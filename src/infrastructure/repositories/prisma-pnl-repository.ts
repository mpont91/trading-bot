import { Pnl as PrismaPnl, Prisma, PrismaClient } from '@prisma/client'
import { PnlRepository } from '../../domain/repositories/pnl-repository'
import type { Pnl, PnlCreate } from '../../domain/models/pnl'
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'
import Decimal from 'decimal.js'

export class PrismaPnlRepository implements PnlRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(pnl: PnlCreate): Promise<void> {
    await this.prisma.pnl.create({
      data: this.toPrisma(pnl),
    })
  }

  async get(interval: TimeInterval): Promise<Pnl[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const equities: PrismaPnl[] = await this.prisma.pnl.findMany({
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

  private toDomain(prismaPnl: PrismaPnl): Pnl {
    return {
      id: prismaPnl.id,
      amount: prismaPnl.amount.toNumber(),
      createdAt: prismaPnl.created_at,
    }
  }

  private toPrisma(pnlCreate: PnlCreate): Prisma.PnlCreateInput {
    return {
      amount: new Decimal(pnlCreate.amount),
    }
  }

  private toDomainList(prismaEquities: PrismaPnl[]): Pnl[] {
    return prismaEquities.map(this.toDomain)
  }
}
