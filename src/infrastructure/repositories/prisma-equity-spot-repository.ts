import {
  EquitySpot as PrismaEquitySpot,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import { EquityRepository } from '../../domain/repositories/equity-repository'
import type { Equity, EquityCreate } from '../../domain/models/equity'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'
import Decimal from 'decimal.js'

export class PrismaEquitySpotRepository implements EquityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(equity: EquityCreate): Promise<void> {
    await this.prisma.equitySpot.create({
      data: this.toPrisma(equity),
    })
  }

  async get(interval: TimeInterval): Promise<Equity[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const equities: PrismaEquitySpot[] = await this.prisma.equitySpot.findMany({
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

  private toDomain(prismaEquitySpot: PrismaEquitySpot): Equity {
    return {
      id: prismaEquitySpot.id,
      amount: prismaEquitySpot.amount.toNumber(),
      createdAt: prismaEquitySpot.created_at,
    }
  }

  private toPrisma(equityCreate: EquityCreate): Prisma.EquitySpotCreateInput {
    return {
      amount: new Decimal(equityCreate.amount),
    }
  }

  private toDomainList(prismaEquitiesSpot: PrismaEquitySpot[]): Equity[] {
    return prismaEquitiesSpot.map(this.toDomain)
  }
}
