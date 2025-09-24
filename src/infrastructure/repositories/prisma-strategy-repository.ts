import {
  Strategy as PrismaStrategy,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { StrategyRepository } from '../../domain/repositories/strategy-repository'
import { Strategy, StrategyCreate } from '../../domain/models/strategy'
import { Side } from '../../domain/types/side'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'

export class PrismaStrategyRepository implements StrategyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(strategy: StrategyCreate): Promise<Strategy> {
    return this.toDomain(
      await this.prisma.strategy.create({
        data: this.toPrisma(strategy),
      }),
    )
  }

  async last(symbol: string): Promise<Strategy | null> {
    const strategy = await this.prisma.strategy.findFirst({
      where: {
        symbol: symbol,
      },
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    if (!strategy) {
      return null
    }

    return this.toDomain(strategy)
  }

  async list(symbol?: string): Promise<Strategy[]> {
    let queryOptions = {}

    if (symbol) {
      const limit: number = 10
      queryOptions = {
        take: limit,
        where: {
          symbol: symbol,
        },
        orderBy: {
          created_at: Prisma.SortOrder.desc,
        },
      }
    } else {
      queryOptions = {
        distinct: ['symbol'],
        orderBy: [
          { symbol: Prisma.SortOrder.asc },
          { created_at: Prisma.SortOrder.desc },
        ],
      }
    }

    const strategies = await this.prisma.strategy.findMany(queryOptions)

    return this.toDomainList(strategies)
  }

  async listOpportunities(symbol?: string): Promise<Strategy[]> {
    let queryOptions = {}

    if (symbol) {
      const limit: number = 10
      queryOptions = {
        take: limit,
        where: {
          symbol: symbol,
          side: { not: 'hold' },
        },
        orderBy: {
          created_at: Prisma.SortOrder.desc,
        },
      }
    } else {
      queryOptions = {
        where: { side: { not: 'hold' } },
        distinct: ['symbol'],
        orderBy: [
          { symbol: Prisma.SortOrder.asc },
          { created_at: Prisma.SortOrder.desc },
        ],
      }
    }

    const strategies = await this.prisma.strategy.findMany(queryOptions)

    return this.toDomainList(strategies)
  }

  async getPriceGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<Strategy[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const strategies = await this.prisma.strategy.findMany({
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
  ): Promise<Strategy[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const strategies = await this.prisma.strategy.findMany({
      where: {
        symbol: symbol,
        side: { not: Side.HOLD },
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

  private toDomain(prismaStrategy: PrismaStrategy): Strategy {
    return {
      id: prismaStrategy.id,
      symbol: prismaStrategy.symbol,
      price: prismaStrategy.price.toNumber(),
      side: prismaStrategy.side,
      tp: prismaStrategy.tp ? prismaStrategy.tp.toNumber() : undefined,
      sl: prismaStrategy.sl ? prismaStrategy.sl.toNumber() : undefined,
      createdAt: prismaStrategy.created_at,
    }
  }

  private toPrisma(strategyCreate: StrategyCreate): Prisma.StrategyCreateInput {
    return {
      symbol: strategyCreate.symbol,
      price: new Decimal(strategyCreate.price),
      side: strategyCreate.side,
      tp: strategyCreate.tp ? new Decimal(strategyCreate.tp) : undefined,
      sl: strategyCreate.sl ? new Decimal(strategyCreate.sl) : undefined,
    }
  }

  private toDomainList(prismaStrategy: PrismaStrategy[]): Strategy[] {
    return prismaStrategy.map(this.toDomain)
  }
}
