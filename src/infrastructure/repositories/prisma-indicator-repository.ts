import { PrismaClient, Prisma } from '@prisma/client'
import { IndicatorRepository } from '../../domain/repositories/indicator-repository'
import { Indicator, IndicatorCreate } from '../../domain/models/indicator'
import Decimal from 'decimal.js'
import { Indicator as PrismaIndicator } from '.prisma/client'

export class PrismaIndicatorRepository implements IndicatorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createMany(indicators: IndicatorCreate[]): Promise<void> {
    await this.prisma.indicator.createMany({
      data: this.toPrismaList(indicators),
    })
  }

  async getLatest(): Promise<Indicator[]> {
    const indicators: PrismaIndicator[] = await this.prisma.$queryRaw<
      PrismaIndicator[]
    >`
SELECT i.*
FROM indicator i
    INNER JOIN (
    SELECT symbol, name, period, MAX(created_at) AS max_created_at
    FROM indicator
    GROUP BY symbol, name, period
    ) latest 
        ON i.symbol = latest.symbol 
        AND i.name = latest.name
        AND i.period = latest.period 
        AND i.created_at = latest.max_created_at`

    return this.toDomainList(indicators)
  }

  private toDomain(prismaIndicator: PrismaIndicator): Indicator {
    return {
      id: prismaIndicator.id,
      name: prismaIndicator.name,
      symbol: prismaIndicator.symbol,
      period: prismaIndicator.period,
      value: prismaIndicator.value.toNumber(),
      price: prismaIndicator.price.toNumber(),
      createdAt: prismaIndicator.created_at,
    }
  }

  private toPrisma(
    indicatorCreate: IndicatorCreate,
  ): Prisma.IndicatorCreateInput {
    return {
      name: indicatorCreate.name,
      symbol: indicatorCreate.symbol,
      period: indicatorCreate.period,
      value: new Decimal(indicatorCreate.value),
      price: new Decimal(indicatorCreate.price),
    }
  }

  private toPrismaList(
    indicators: IndicatorCreate[],
  ): Prisma.IndicatorCreateInput[] {
    return indicators.map(this.toPrisma)
  }

  private toDomainList(prismaIndicator: PrismaIndicator[]): Indicator[] {
    return prismaIndicator.map(this.toDomain)
  }
}
