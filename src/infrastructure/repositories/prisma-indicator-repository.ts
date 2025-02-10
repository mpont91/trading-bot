import { PrismaClient, Prisma } from '@prisma/client'
import { IndicatorRepository } from '../../domain/repositories/indicator-repository'
import { IndicatorCreate } from '../../domain/models/indicator'
import Decimal from 'decimal.js'

export class PrismaIndicatorRepository implements IndicatorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createMany(indicators: IndicatorCreate[]): Promise<void> {
    await this.prisma.indicator.createMany({
      data: indicators.map(this.toPrisma),
    })
  }

  private toPrisma(
    indicatorCreate: IndicatorCreate,
  ): Prisma.IndicatorCreateInput {
    return {
      name: indicatorCreate.name,
      symbol: indicatorCreate.symbol,
      period: indicatorCreate.period,
      value: new Decimal(indicatorCreate.value),
    }
  }
}
