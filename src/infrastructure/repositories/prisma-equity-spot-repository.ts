import {
  SpotEquity as PrismaSpotEquity,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import { EquityRepository } from '../../domain/repositories/equity-repository'
import type { Equity, EquityCreate } from '../../domain/models/equity'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'

export class PrismaEquitySpotRepository implements EquityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(equity: EquityCreate): Promise<void> {
    await this.prisma.spotEquity.create({
      data: equity,
    })
  }

  async get(interval: TimeInterval): Promise<Equity[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const equities: PrismaSpotEquity[] = await this.prisma.spotEquity.findMany({
      where: {
        created_at: {
          gte: startTime,
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    })

    return this.toDomainList(equities)
  }

  private toDomain(prismaSpotEquity: PrismaSpotEquity): Equity {
    return {
      id: prismaSpotEquity.id,
      amount: prismaSpotEquity.amount.toNumber(),
      createdAt: prismaSpotEquity.created_at,
    }
  }

  private toDomainList(prismaSpotEquities: PrismaSpotEquity[]): Equity[] {
    return prismaSpotEquities.map(this.toDomain)
  }
}
