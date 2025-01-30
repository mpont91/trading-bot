import {
  FuturesEquity as PrismaFuturesEquity,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import { EquityRepository } from '../../domain/repositories/equity-repository'
import type { Equity, EquityCreate } from '../../domain/models/equity'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartDateFromTimeInterval } from '../../domain/helpers/time-interval-helper'

export class PrismaFuturesEquityRepository implements EquityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(equity: EquityCreate): Promise<void> {
    await this.prisma.futuresEquity.create({
      data: equity,
    })
  }

  async get(interval: TimeInterval): Promise<Equity[]> {
    const startDate: Date = getStartDateFromTimeInterval(interval)

    const equities: PrismaFuturesEquity[] =
      await this.prisma.futuresEquity.findMany({
        where: {
          created_at: {
            gte: startDate,
          },
        },
        orderBy: {
          created_at: Prisma.SortOrder.asc,
        },
      })

    return this.toDomainList(equities)
  }

  private toDomain(prismaFuturesEquity: PrismaFuturesEquity): Equity {
    return {
      id: prismaFuturesEquity.id,
      amount: prismaFuturesEquity.amount.toNumber(),
      createdAt: prismaFuturesEquity.created_at,
    }
  }

  private toDomainList(prismaFuturesEquities: PrismaFuturesEquity[]): Equity[] {
    return prismaFuturesEquities.map(this.toDomain)
  }
}
