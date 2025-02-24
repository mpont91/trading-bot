import { Prisma, PrismaClient } from '@prisma/client'
import { IndicatorRepository } from '../../domain/repositories/indicator-repository'
import { BbIndicatorModelCreate } from '../../domain/models/indicator'
import Decimal from 'decimal.js'

export class PrismaIndicatorRepository implements IndicatorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createBB(indicator: BbIndicatorModelCreate): Promise<void> {
    await this.prisma.indicatorBB.create({
      data: this.toPrismaBB(indicator),
    })
  }

  private toPrismaBB(
    indicator: BbIndicatorModelCreate,
  ): Prisma.IndicatorBBCreateInput {
    return {
      period: indicator.period,
      symbol: indicator.symbol,
      price: new Decimal(indicator.price),
      upper: new Decimal(indicator.upper),
      middle: new Decimal(indicator.middle),
      lower: new Decimal(indicator.lower),
      pb: new Decimal(indicator.pb),
    }
  }
}
