import {
  SpotCommissionEquity as PrismaSpotCommissionEquity,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import {
  CommissionEquity,
  CommissionEquityCreate,
} from '../../domain/models/commission-equity'
import { CommissionEquityRepository } from '../../domain/repositories/commission-equity-repository'
import { getEmptyCommissionEquity } from '../../domain/helpers/commission-spot-helper'

export class PrismaCommissionEquitySpotRepository
  implements CommissionEquityRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(commissionEquityCreate: CommissionEquityCreate): Promise<void> {
    await this.prisma.spotCommissionEquity.create({
      data: commissionEquityCreate,
    })
  }

  async get(): Promise<CommissionEquity> {
    const commissionEquity = await this.prisma.spotCommissionEquity.findFirst({
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    if (!commissionEquity) {
      return getEmptyCommissionEquity()
    }

    return this.toDomain(commissionEquity as PrismaSpotCommissionEquity)
  }

  private toDomain(
    prismaSpotCommissionEquity: PrismaSpotCommissionEquity,
  ): CommissionEquity {
    return {
      id: prismaSpotCommissionEquity.id,
      currency: prismaSpotCommissionEquity.currency,
      quantity: prismaSpotCommissionEquity.quantity.toNumber(),
      amount: prismaSpotCommissionEquity.amount.toNumber(),
      createdAt: prismaSpotCommissionEquity.created_at,
    }
  }
}
