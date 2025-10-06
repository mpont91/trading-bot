import { Equity as PrismaEquity, Prisma, PrismaClient } from '@prisma/client'
import { EquityRepository } from '../../domain/repositories/equity-repository'
import {
  Equity,
  EquityCreate,
  equityCreateSchema,
} from '../../domain/models/equity'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'
import Decimal from 'decimal.js'
import { prismaEquitySchema } from './schemas/prisma-equity-schema'

export class PrismaEquityRepository implements EquityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(equity: EquityCreate): Promise<Equity> {
    return this.toDomain(
      await this.prisma.equity.create({
        data: this.toPrisma(equity),
      }),
    )
  }

  async get(interval: TimeInterval): Promise<Equity[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const equities: PrismaEquity[] = await this.prisma.equity.findMany({
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

  private toDomain(prismaEquity: PrismaEquity): Equity {
    return prismaEquitySchema.parse(prismaEquity)
  }

  private toPrisma(equityCreate: EquityCreate): Prisma.EquityCreateInput {
    equityCreateSchema.parse(equityCreate)

    return {
      amount: new Decimal(equityCreate.amount),
    }
  }

  private toDomainList(prismaEquities: PrismaEquity[]): Equity[] {
    return prismaEquities.map(this.toDomain)
  }
}
