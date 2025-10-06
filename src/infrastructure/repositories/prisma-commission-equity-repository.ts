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
import {
  domainCommissionEquitySchema,
  prismaCommissionEquitySchema,
} from './schemas/prisma-commission-equity-schema'

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

  async get(): Promise<CommissionEquity | null> {
    const commissionEquity = await this.prisma.commissionEquity.findFirst({
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    if (!commissionEquity) {
      return null
    }

    return this.toDomain(commissionEquity)
  }

  private toDomain(
    prismaCommissionEquity: PrismaCommissionEquity,
  ): CommissionEquity {
    return domainCommissionEquitySchema.parse(prismaCommissionEquity)
  }

  private toPrisma(
    commissionEquityCreate: CommissionEquityCreate,
  ): Prisma.CommissionEquityCreateInput {
    return prismaCommissionEquitySchema.parse(commissionEquityCreate)
  }
}
