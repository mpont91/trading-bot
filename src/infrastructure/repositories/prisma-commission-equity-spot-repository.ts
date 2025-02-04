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
import { settings } from '../../application/settings'

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
      return this.getEmptyCommissionEquity()
    }

    return this.toDomain(commissionEquity as PrismaSpotCommissionEquity)
  }

  private getEmptyCommissionEquity(): CommissionEquity {
    return {
      id: 1,
      currency: settings.binance.feeCurrency,
      quantity: 0,
      amount: 0,
      createdAt: new Date(),
    }
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
