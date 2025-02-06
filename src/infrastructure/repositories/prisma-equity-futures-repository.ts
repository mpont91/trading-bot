import {
  EquityFutures as PrismaEquityFutures,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import { EquityRepository } from '../../domain/repositories/equity-repository'
import type { Equity, EquityCreate } from '../../domain/models/equity'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'
import Decimal from 'decimal.js'

export class PrismaEquityFuturesRepository implements EquityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(equity: EquityCreate): Promise<void> {
    await this.prisma.equityFutures.create({
      data: this.toPrisma(equity),
    })
  }

  async get(interval: TimeInterval): Promise<Equity[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const equities: PrismaEquityFutures[] =
      await this.prisma.equityFutures.findMany({
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

  private toDomain(prismaEquityFutures: PrismaEquityFutures): Equity {
    return {
      id: prismaEquityFutures.id,
      amount: prismaEquityFutures.amount.toNumber(),
      createdAt: prismaEquityFutures.created_at,
    }
  }

  private toPrisma(
    equityCreate: EquityCreate,
  ): Prisma.EquityFuturesCreateInput {
    return {
      amount: new Decimal(equityCreate.amount),
    }
  }

  private toDomainList(prismaEquitiesFutures: PrismaEquityFutures[]): Equity[] {
    return prismaEquitiesFutures.map(this.toDomain)
  }
}
