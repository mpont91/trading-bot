import { Prisma, PrismaClient } from '@prisma/client'
import { IndicatorRepository } from '../../domain/repositories/indicator-repository'
import {
  IndicatorADXCreate,
  IndicatorATRCreate,
  IndicatorBBCreate,
  IndicatorRSICreate,
  IndicatorSMACreate,
} from '../../domain/models/indicator'
import Decimal from 'decimal.js'

export class PrismaIndicatorRepository implements IndicatorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createSMA(indicator: IndicatorSMACreate): Promise<void> {
    await this.prisma.indicatorSMA.create({
      data: this.toPrismaSMA(indicator),
    })
  }

  async createRSI(indicator: IndicatorRSICreate): Promise<void> {
    await this.prisma.indicatorRSI.create({
      data: this.toPrismaRSI(indicator),
    })
  }

  async createATR(indicator: IndicatorATRCreate): Promise<void> {
    await this.prisma.indicatorATR.create({
      data: this.toPrismaATR(indicator),
    })
  }

  async createADX(indicator: IndicatorADXCreate): Promise<void> {
    await this.prisma.indicatorADX.create({
      data: this.toPrismaADX(indicator),
    })
  }

  async createBB(indicator: IndicatorBBCreate): Promise<void> {
    await this.prisma.indicatorBB.create({
      data: this.toPrismaBB(indicator),
    })
  }

  private toPrismaSMA(
    indicator: IndicatorSMACreate,
  ): Prisma.IndicatorSMACreateInput {
    return {
      period: indicator.period,
      symbol: indicator.symbol,
      price: new Decimal(indicator.price),
      sma: new Decimal(indicator.sma),
    }
  }

  private toPrismaRSI(
    indicator: IndicatorRSICreate,
  ): Prisma.IndicatorRSICreateInput {
    return {
      period: indicator.period,
      symbol: indicator.symbol,
      price: new Decimal(indicator.price),
      rsi: new Decimal(indicator.rsi),
    }
  }

  private toPrismaATR(
    indicator: IndicatorATRCreate,
  ): Prisma.IndicatorATRCreateInput {
    return {
      period: indicator.period,
      symbol: indicator.symbol,
      price: new Decimal(indicator.price),
      atr: new Decimal(indicator.atr),
    }
  }

  private toPrismaADX(
    indicator: IndicatorADXCreate,
  ): Prisma.IndicatorADXCreateInput {
    return {
      period: indicator.period,
      symbol: indicator.symbol,
      price: new Decimal(indicator.price),
      adx: new Decimal(indicator.adx),
      pdi: new Decimal(indicator.pdi),
      mdi: new Decimal(indicator.mdi),
    }
  }

  private toPrismaBB(
    indicator: IndicatorBBCreate,
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
