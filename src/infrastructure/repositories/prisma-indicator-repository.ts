import {
  Prisma,
  PrismaClient,
  IndicatorSMA as PrismaIndicatorSMA,
  IndicatorRSI as PrismaIndicatorRSI,
  IndicatorATR as PrismaIndicatorATR,
  IndicatorADX as PrismaIndicatorADX,
  IndicatorBB as PrismaIndicatorBB,
  IndicatorSMACross as PrismaIndicatorSMACross,
} from '@prisma/client'

import { IndicatorRepository } from '../../domain/repositories/indicator-repository'
import {
  IndicatorADXCreate,
  IndicatorATRCreate,
  IndicatorBBCreate,
  IndicatorRSICreate,
  IndicatorSMACreate,
  IndicatorSMACrossCreate,
  IndicatorSMA,
  IndicatorRSI,
  IndicatorATR,
  IndicatorADX,
  IndicatorBB,
  IndicatorSMACross,
} from '../../domain/models/indicator'
import Decimal from 'decimal.js'

export class PrismaIndicatorRepository implements IndicatorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createSMA(indicator: IndicatorSMACreate): Promise<void> {
    await this.prisma.indicatorSMA.create({
      data: this.toPrismaSMA(indicator),
    })
  }

  async getSMA(symbol: string): Promise<IndicatorSMA | null> {
    const indicator = await this.prisma.indicatorSMA.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainSMA(indicator as PrismaIndicatorSMA)
  }

  async createRSI(indicator: IndicatorRSICreate): Promise<void> {
    await this.prisma.indicatorRSI.create({
      data: this.toPrismaRSI(indicator),
    })
  }

  async getRSI(symbol: string): Promise<IndicatorRSI | null> {
    const indicator = await this.prisma.indicatorRSI.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainRSI(indicator as PrismaIndicatorRSI)
  }

  async createATR(indicator: IndicatorATRCreate): Promise<void> {
    await this.prisma.indicatorATR.create({
      data: this.toPrismaATR(indicator),
    })
  }

  async getATR(symbol: string): Promise<IndicatorATR | null> {
    const indicator = await this.prisma.indicatorATR.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainATR(indicator as PrismaIndicatorATR)
  }

  async createADX(indicator: IndicatorADXCreate): Promise<void> {
    await this.prisma.indicatorADX.create({
      data: this.toPrismaADX(indicator),
    })
  }

  async getADX(symbol: string): Promise<IndicatorADX | null> {
    const indicator = await this.prisma.indicatorADX.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainADX(indicator as PrismaIndicatorADX)
  }

  async createBB(indicator: IndicatorBBCreate): Promise<void> {
    await this.prisma.indicatorBB.create({
      data: this.toPrismaBB(indicator),
    })
  }

  async getBB(symbol: string): Promise<IndicatorBB | null> {
    const indicator = await this.prisma.indicatorBB.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainBB(indicator as PrismaIndicatorBB)
  }

  async createSMACross(indicator: IndicatorSMACrossCreate): Promise<void> {
    await this.prisma.indicatorSMACross.create({
      data: this.toPrismaSMACross(indicator),
    })
  }

  async getSMACross(symbol: string): Promise<IndicatorSMACross | null> {
    const indicator = await this.prisma.indicatorSMACross.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainSMACross(indicator as PrismaIndicatorSMACross)
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

  private toPrismaSMACross(
    indicator: IndicatorSMACrossCreate,
  ): Prisma.IndicatorSMACrossCreateInput {
    return {
      period_long: indicator.periodLong,
      period_short: indicator.periodShort,
      symbol: indicator.symbol,
      price: new Decimal(indicator.price),
      sma_long: new Decimal(indicator.smaLong),
      sma_short: new Decimal(indicator.smaShort),
    }
  }

  private toDomainSMA(prismaIndicatorSMA: PrismaIndicatorSMA): IndicatorSMA {
    return {
      id: prismaIndicatorSMA.id,
      period: prismaIndicatorSMA.period,
      symbol: prismaIndicatorSMA.symbol,
      price: prismaIndicatorSMA.price.toNumber(),
      sma: prismaIndicatorSMA.sma.toNumber(),
      createdAt: prismaIndicatorSMA.created_at,
    }
  }

  private toDomainRSI(prismaIndicatorRSI: PrismaIndicatorRSI): IndicatorRSI {
    return {
      id: prismaIndicatorRSI.id,
      period: prismaIndicatorRSI.period,
      symbol: prismaIndicatorRSI.symbol,
      price: prismaIndicatorRSI.price.toNumber(),
      rsi: prismaIndicatorRSI.rsi.toNumber(),
      createdAt: prismaIndicatorRSI.created_at,
    }
  }

  private toDomainATR(prismaIndicatorATR: PrismaIndicatorATR): IndicatorATR {
    return {
      id: prismaIndicatorATR.id,
      period: prismaIndicatorATR.period,
      symbol: prismaIndicatorATR.symbol,
      price: prismaIndicatorATR.price.toNumber(),
      atr: prismaIndicatorATR.atr.toNumber(),
      createdAt: prismaIndicatorATR.created_at,
    }
  }

  private toDomainADX(prismaIndicatorADX: PrismaIndicatorADX): IndicatorADX {
    return {
      id: prismaIndicatorADX.id,
      period: prismaIndicatorADX.period,
      symbol: prismaIndicatorADX.symbol,
      price: prismaIndicatorADX.price.toNumber(),
      adx: prismaIndicatorADX.adx.toNumber(),
      pdi: prismaIndicatorADX.pdi.toNumber(),
      mdi: prismaIndicatorADX.mdi.toNumber(),
      createdAt: prismaIndicatorADX.created_at,
    }
  }

  private toDomainBB(prismaIndicatorBB: PrismaIndicatorBB): IndicatorBB {
    return {
      id: prismaIndicatorBB.id,
      period: prismaIndicatorBB.period,
      symbol: prismaIndicatorBB.symbol,
      price: prismaIndicatorBB.price.toNumber(),
      upper: prismaIndicatorBB.upper.toNumber(),
      middle: prismaIndicatorBB.middle.toNumber(),
      lower: prismaIndicatorBB.lower.toNumber(),
      pb: prismaIndicatorBB.pb.toNumber(),
      createdAt: prismaIndicatorBB.created_at,
    }
  }

  private toDomainSMACross(
    prismaIndicatorSMACross: PrismaIndicatorSMACross,
  ): IndicatorSMACross {
    return {
      id: prismaIndicatorSMACross.id,
      periodLong: prismaIndicatorSMACross.period_long,
      periodShort: prismaIndicatorSMACross.period_short,
      symbol: prismaIndicatorSMACross.symbol,
      price: prismaIndicatorSMACross.price.toNumber(),
      smaLong: prismaIndicatorSMACross.sma_long.toNumber(),
      smaShort: prismaIndicatorSMACross.sma_short.toNumber(),
      createdAt: prismaIndicatorSMACross.created_at,
    }
  }
}
