import {
  StrategyAction as PrismaStrategyAction,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import { StrategyActionRepository } from '../../domain/repositories/strategy-action-repository'
import {
  StrategyAction,
  StrategyActionCreate,
} from '../../domain/models/strategy-action'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'
import { Signal } from '../../domain/types/signal'
import {
  domainStrategyActionSchema,
  prismaStrategyActionSchema,
} from './schemas/prisma-strategy-action-schema'

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
    return domainStrategyActionSchema.parse(prismaStrategyAction)
  }

  private toPrisma(
    strategyActionCreate: StrategyActionCreate,
  ): Prisma.StrategyActionCreateInput {
    return prismaStrategyActionSchema.parse(strategyActionCreate)
  }

  private toDomainList(
    prismaStrategy: PrismaStrategyAction[],
  ): StrategyAction[] {
    return prismaStrategy.map(this.toDomain)
  }
}
