import {
  StrategyAction as PrismaStrategyAction,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { StrategyActionRepository } from '../../domain/repositories/strategy-action-repository'
import {
  StrategyAction,
  StrategyActionCreate,
} from '../../domain/models/strategy-action'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'
import { Signal } from '../../domain/types/signal'

export class PrismaStrategyActionRepository
  implements StrategyActionRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(strategyAction: StrategyActionCreate): Promise<StrategyAction> {
    return this.toDomain(
      await this.prisma.strategyAction.create({
        data: this.toPrisma(strategyAction),
      }),
    )
  }

  async last(symbol: string): Promise<StrategyAction | null> {
    const strategyAction = await this.prisma.strategyAction.findFirst({
      where: {
        symbol: symbol,
      },
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    if (!strategyAction) {
      return null
    }

    return this.toDomain(strategyAction)
  }

  async list(symbol?: string): Promise<StrategyAction[]> {
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

    const StrategyActionList =
      await this.prisma.strategyAction.findMany(queryOptions)

    return this.toDomainList(StrategyActionList)
  }

  async listOpportunities(symbol?: string): Promise<StrategyAction[]> {
    let queryOptions = {}

    if (symbol) {
      const limit: number = 10
      queryOptions = {
        take: limit,
        where: {
          symbol: symbol,
          signal: { not: Signal.HOLD },
        },
        orderBy: {
          created_at: Prisma.SortOrder.desc,
        },
      }
    } else {
      queryOptions = {
        where: { signal: { not: Signal.HOLD } },
        distinct: ['symbol'],
        orderBy: [
          { symbol: Prisma.SortOrder.asc },
          { created_at: Prisma.SortOrder.desc },
        ],
      }
    }

    const opportunities =
      await this.prisma.strategyAction.findMany(queryOptions)

    return this.toDomainList(opportunities)
  }

  async getPriceGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<StrategyAction[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const strategyActionList = await this.prisma.strategyAction.findMany({
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

    return this.toDomainList(strategyActionList)
  }

  async getOpportunitiesGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<StrategyAction[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const opportunities = await this.prisma.strategyAction.findMany({
      where: {
        symbol: symbol,
        signal: { not: Signal.HOLD },
        created_at: {
          gte: startTime,
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    })

    return this.toDomainList(opportunities)
  }

  private toDomain(prismaStrategyAction: PrismaStrategyAction): StrategyAction {
    return {
      id: prismaStrategyAction.id,
      symbol: prismaStrategyAction.symbol,
      price: prismaStrategyAction.price.toNumber(),
      signal: prismaStrategyAction.signal,
      tp: prismaStrategyAction.tp ? prismaStrategyAction.tp.toNumber() : null,
      sl: prismaStrategyAction.sl ? prismaStrategyAction.sl.toNumber() : null,
      ts: prismaStrategyAction.ts ? prismaStrategyAction.ts.toNumber() : null,
      tpPrice: prismaStrategyAction.tp_price
        ? prismaStrategyAction.tp_price.toNumber()
        : null,
      slPrice: prismaStrategyAction.sl_price
        ? prismaStrategyAction.sl_price.toNumber()
        : null,
      createdAt: prismaStrategyAction.created_at,
    }
  }

  private toPrisma(
    strategyAction: StrategyActionCreate,
  ): Prisma.StrategyActionCreateInput {
    return {
      symbol: strategyAction.symbol,
      price: new Decimal(strategyAction.price),
      signal: strategyAction.signal,
      tp: strategyAction.tp ? new Decimal(strategyAction.tp) : undefined,
      sl: strategyAction.sl ? new Decimal(strategyAction.sl) : undefined,
      ts: strategyAction.ts ? new Decimal(strategyAction.ts) : undefined,
      tp_price: strategyAction.tpPrice
        ? new Decimal(strategyAction.tpPrice)
        : undefined,
      sl_price: strategyAction.slPrice
        ? new Decimal(strategyAction.slPrice)
        : undefined,
    }
  }

  private toDomainList(
    prismaStrategy: PrismaStrategyAction[],
  ): StrategyAction[] {
    return prismaStrategy.map(this.toDomain)
  }
}
