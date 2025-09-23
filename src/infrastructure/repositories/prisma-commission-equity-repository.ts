import {
  CommissionEquity as PrismaCommissionEquity,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import {
  CommissionEquity,
  CommissionEquityCreate,
} from '../../domain/models/commission-equity'
import { CommissionEquityRepository } from '../../domain/repositories/commission-equity-repository'
import { getEmptyCommissionEquity } from '../../domain/helpers/commission-helper'
import Decimal from 'decimal.js'

export class PrismaCommissionEquityRepository
  implements CommissionEquityRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    commissionEquityCreate: CommissionEquityCreate,
  ): Promise<CommissionEquity> {
    return this.toDomain(
      await this.prisma.commissionEquity.create({
        data: this.toPrisma(commissionEquityCreate),
      }),
    )
  }

  async get(): Promise<CommissionEquity> {
    const commissionEquity = await this.prisma.commissionEquity.findFirst({
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    if (!commissionEquity) {
      return getEmptyCommissionEquity()
    }

    return this.toDomain(commissionEquity as PrismaCommissionEquity)
  }

  private toDomain(
    prismaCommissionEquity: PrismaCommissionEquity,
  ): CommissionEquity {
    return {
      id: prismaCommissionEquity.id,
      currency: prismaCommissionEquity.currency,
      quantity: prismaCommissionEquity.quantity.toNumber(),
      amount: prismaCommissionEquity.amount.toNumber(),
      createdAt: prismaCommissionEquity.created_at,
    }
  }

  private toPrisma(
    commissionEquityCreate: CommissionEquityCreate,
  ): Prisma.CommissionEquityCreateInput {
    return {
      currency: commissionEquityCreate.currency,
      quantity: new Decimal(commissionEquityCreate.quantity),
      amount: new Decimal(commissionEquityCreate.amount),
    }
  }
}
