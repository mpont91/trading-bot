import {
  StrategySpot as PrismaStrategySpot,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { StrategyRepository } from '../../domain/repositories/strategy-repository'
import {
  Strategy,
  StrategySpot,
  StrategyCreate,
  StrategySpotCreate,
} from '../../domain/models/strategy'
import { Side } from '../../domain/types/side'
import { getEmptyStrategy } from '../../domain/helpers/strategy-helper'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'

export class PrismaStrategySpotRepository implements StrategyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(strategy: StrategyCreate): Promise<void> {
    await this.prisma.strategySpot.create({
      data: this.toPrisma(strategy),
    })
  }

  async getLastForSymbol(symbol: string): Promise<StrategySpot> {
    const strategy = await this.prisma.strategySpot.findFirst({
      where: {
        symbol: symbol,
      },
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    if (!strategy) {
      return getEmptyStrategy(symbol)
    }

    return this.toDomain(strategy as PrismaStrategySpot)
  }

  async getLastManyForSymbol(
    symbol: string,
    limit: number = 10,
  ): Promise<Strategy[]> {
    const strategies = await this.prisma.strategySpot.findMany({
      take: limit,
      where: {
        symbol: symbol,
      },
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    return this.toDomainList(strategies)
  }

  async getLastManyOpportunitiesForSymbol(
    symbol: string,
    limit: number = 10,
  ): Promise<Strategy[]> {
    const strategies = await this.prisma.strategySpot.findMany({
      take: limit,
      where: {
        symbol: symbol,
        side: { not: 'hold' },
      },
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    return this.toDomainList(strategies)
  }

  async getLastManyForEachSymbol(): Promise<Strategy[]> {
    const strategies: PrismaStrategySpot[] = await this.prisma.$queryRaw<
      PrismaStrategySpot[]
    >`
SELECT s.*
FROM strategy s
    INNER JOIN (
        SELECT symbol, MAX(created_at) AS max_created_at
        FROM strategy
        GROUP BY symbol
    ) last
    ON s.symbol = last.symbol
    AND s.created_at = last.max_created_at
    ORDER BY s.created_at DESC`

    return this.toDomainList(strategies)
  }

  async getLastManyOpportunitiesForEachSymbol(): Promise<Strategy[]> {
    const strategies: PrismaStrategySpot[] = await this.prisma.$queryRaw<
      PrismaStrategySpot[]
    >`
SELECT s.*
FROM strategy s
    INNER JOIN (
        SELECT symbol, MAX(created_at) AS max_created_at
        FROM strategy
        WHERE side <> 'hold'
        GROUP BY symbol
    ) last
    ON s.symbol = last.symbol
    AND s.created_at = last.max_created_at
    ORDER BY s.created_at DESC`

    return this.toDomainList(strategies)
  }

  async getPriceGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<Strategy[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const strategies = await this.prisma.strategySpot.findMany({
      where: {
        symbol: symbol,
        created_at: {
          gte: startTime,
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    })

    return this.toDomainList(strategies)
  }

  async getOpportunitiesGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<StrategySpot[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const strategies = await this.prisma.strategySpot.findMany({
      where: {
        symbol: symbol,
        side: { not: 'hold' },
        created_at: {
          gte: startTime,
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    })

    return this.toDomainList(strategies)
  }

  private toDomain(prismaStrategy: PrismaStrategySpot): StrategySpot {
    return {
      id: prismaStrategy.id,
      symbol: prismaStrategy.symbol,
      price: prismaStrategy.price.toNumber(),
      side: prismaStrategy.side as Side,
      tp: prismaStrategy.tp ? prismaStrategy.tp.toNumber() : undefined,
      sl: prismaStrategy.sl ? prismaStrategy.sl.toNumber() : undefined,
      createdAt: prismaStrategy.created_at,
    }
  }

  private toPrisma(
    strategyCreate: StrategySpotCreate,
  ): Prisma.StrategySpotCreateInput {
    return {
      symbol: strategyCreate.symbol,
      price: new Decimal(strategyCreate.price),
      side: strategyCreate.side,
      tp: strategyCreate.tp ? new Decimal(strategyCreate.tp) : undefined,
      sl: strategyCreate.sl ? new Decimal(strategyCreate.sl) : undefined,
    }
  }

  private toDomainList(
    prismaStrategySpot: PrismaStrategySpot[],
  ): StrategySpot[] {
    return prismaStrategySpot.map(this.toDomain)
  }
}
