import {
  StrategyFutures as PrismaStrategyFutures,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { StrategyRepository } from '../../domain/repositories/strategy-repository'
import {
  Strategy,
  StrategyFutures,
  StrategyCreate,
  StrategyFuturesCreate,
} from '../../domain/models/strategy'
import { Side } from '../../domain/types/side'
import { getEmptyStrategy } from '../../domain/helpers/strategy-helper'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'

export class PrismaStrategyFuturesRepository implements StrategyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(strategy: StrategyCreate): Promise<void> {
    await this.prisma.strategyFutures.create({
      data: this.toPrisma(strategy),
    })
  }

  async getLastForSymbol(symbol: string): Promise<StrategyFutures> {
    const strategy = await this.prisma.strategyFutures.findFirst({
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

    return this.toDomain(strategy as PrismaStrategyFutures)
  }

  async getLastManyForSymbol(
    symbol: string,
    limit: number = 10,
  ): Promise<Strategy[]> {
    const strategies = await this.prisma.strategyFutures.findMany({
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
    const strategies = await this.prisma.strategyFutures.findMany({
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
    const strategies: PrismaStrategyFutures[] = await this.prisma.$queryRaw<
      PrismaStrategyFutures[]
    >`
SELECT s.*
FROM StrategyFutures s
    INNER JOIN (
        SELECT symbol, MAX(created_at) AS max_created_at
        FROM StrategyFutures
        GROUP BY symbol
    ) last
    ON s.symbol = last.symbol
    AND s.created_at = last.max_created_at
    ORDER BY s.created_at DESC`

    return this.toDomainList(strategies)
  }

  async getLastManyOpportunitiesForEachSymbol(): Promise<Strategy[]> {
    const strategies: PrismaStrategyFutures[] = await this.prisma.$queryRaw<
      PrismaStrategyFutures[]
    >`
SELECT s.*
FROM StrategyFutures s
    INNER JOIN (
        SELECT symbol, MAX(created_at) AS max_created_at
        FROM StrategyFutures
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
  ): Promise<StrategyFutures[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const strategies = await this.prisma.strategyFutures.findMany({
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
  ): Promise<StrategyFutures[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const strategies = await this.prisma.strategyFutures.findMany({
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

  private toDomain(prismaStrategy: PrismaStrategyFutures): StrategyFutures {
    return {
      id: prismaStrategy.id,
      symbol: prismaStrategy.symbol,
      price: prismaStrategy.price.toNumber(),
      side: prismaStrategy.side as Side,
      tp: prismaStrategy.tp ? prismaStrategy.tp.toNumber() : undefined,
      sl: prismaStrategy.sl ? prismaStrategy.sl.toNumber() : undefined,
      leverage: prismaStrategy.leverage ? prismaStrategy.leverage : undefined,
      createdAt: prismaStrategy.created_at,
    }
  }

  private toPrisma(
    strategyCreate: StrategyFuturesCreate,
  ): Prisma.StrategyFuturesCreateInput {
    return {
      symbol: strategyCreate.symbol,
      price: new Decimal(strategyCreate.price),
      side: strategyCreate.side,
      tp: strategyCreate.tp ? new Decimal(strategyCreate.tp) : undefined,
      sl: strategyCreate.sl ? new Decimal(strategyCreate.sl) : undefined,
      leverage: strategyCreate.leverage ? strategyCreate.leverage : undefined,
    }
  }

  private toDomainList(
    prismaStrategyFutures: PrismaStrategyFutures[],
  ): StrategyFutures[] {
    return prismaStrategyFutures.map(this.toDomain)
  }
}
