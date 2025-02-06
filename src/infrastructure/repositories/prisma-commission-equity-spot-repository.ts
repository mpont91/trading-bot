import {
  CommissionEquitySpot as PrismaCommissionEquitySpot,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import {
  CommissionEquity,
  CommissionEquityCreate,
} from '../../domain/models/commission-equity'
import { CommissionEquityRepository } from '../../domain/repositories/commission-equity-repository'
import { getEmptyCommissionEquity } from '../../domain/helpers/commission-spot-helper'
import Decimal from 'decimal.js'

export class PrismaCommissionEquitySpotRepository
  implements CommissionEquityRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(commissionEquityCreate: CommissionEquityCreate): Promise<void> {
    await this.prisma.commissionEquitySpot.create({
      data: this.toPrisma(commissionEquityCreate),
    })
  }

  async get(): Promise<CommissionEquity> {
    const commissionEquity = await this.prisma.commissionEquitySpot.findFirst({
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    if (!commissionEquity) {
      return getEmptyCommissionEquity()
    }

    return this.toDomain(commissionEquity as PrismaCommissionEquitySpot)
  }

  private toDomain(
    prismaCommissionEquitySpot: PrismaCommissionEquitySpot,
  ): CommissionEquity {
    return {
      id: prismaCommissionEquitySpot.id,
      currency: prismaCommissionEquitySpot.currency,
      quantity: prismaCommissionEquitySpot.quantity.toNumber(),
      amount: prismaCommissionEquitySpot.amount.toNumber(),
      createdAt: prismaCommissionEquitySpot.created_at,
    }
  }

  private toPrisma(
    commissionEquityCreate: CommissionEquityCreate,
  ): Prisma.CommissionEquitySpotCreateInput {
    return {
      currency: commissionEquityCreate.currency,
      quantity: new Decimal(commissionEquityCreate.quantity),
      amount: new Decimal(commissionEquityCreate.amount),
    }
  }
}
