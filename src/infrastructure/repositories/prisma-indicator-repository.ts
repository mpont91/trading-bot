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
import { TimeInterval } from '../../domain/types/time-interval'
import { getStartTimeFromTimeInterval } from '../../domain/helpers/time-interval-helper'
import {
  domainIndicatorADXSchema,
  domainIndicatorATRSchema,
  domainIndicatorBBSchema,
  domainIndicatorRSISchema,
  domainIndicatorSMACrossSchema,
  domainIndicatorSMASchema,
  prismaIndicatorADXSchema,
  prismaIndicatorATRSchema,
  prismaIndicatorBBSchema,
  prismaIndicatorRSISchema,
  prismaIndicatorSMACrossSchema,
  prismaIndicatorSMASchema,
} from './schemas/prisma-indicator-schema'

export class PrismaIndicatorRepository implements IndicatorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createSMA(indicator: IndicatorSMACreate): Promise<IndicatorSMA> {
    return this.toDomainSMA(
      await this.prisma.indicatorSMA.create({
        data: this.toPrismaSMA(indicator),
      }),
    )
  }

  async getSMA(symbol: string): Promise<IndicatorSMA | null> {
    const indicator = await this.prisma.indicatorSMA.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainSMA(indicator)
  }

  async createRSI(indicator: IndicatorRSICreate): Promise<IndicatorRSI> {
    return this.toDomainRSI(
      await this.prisma.indicatorRSI.create({
        data: this.toPrismaRSI(indicator),
      }),
    )
  }

  async getRSI(symbol: string): Promise<IndicatorRSI | null> {
    const indicator = await this.prisma.indicatorRSI.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainRSI(indicator)
  }

  async createATR(indicator: IndicatorATRCreate): Promise<IndicatorATR> {
    return this.toDomainATR(
      await this.prisma.indicatorATR.create({
        data: this.toPrismaATR(indicator),
      }),
    )
  }

  async getATR(symbol: string): Promise<IndicatorATR | null> {
    const indicator = await this.prisma.indicatorATR.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainATR(indicator)
  }

  async createADX(indicator: IndicatorADXCreate): Promise<IndicatorADX> {
    return this.toDomainADX(
      await this.prisma.indicatorADX.create({
        data: this.toPrismaADX(indicator),
      }),
    )
  }

  async getADX(symbol: string): Promise<IndicatorADX | null> {
    const indicator = await this.prisma.indicatorADX.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainADX(indicator)
  }

  async createBB(indicator: IndicatorBBCreate): Promise<IndicatorBB> {
    return this.toDomainBB(
      await this.prisma.indicatorBB.create({
        data: this.toPrismaBB(indicator),
      }),
    )
  }

  async getBB(symbol: string): Promise<IndicatorBB | null> {
    const indicator = await this.prisma.indicatorBB.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainBB(indicator)
  }

  async createSMACross(
    indicator: IndicatorSMACrossCreate,
  ): Promise<IndicatorSMACross> {
    return this.toDomainSMACross(
      await this.prisma.indicatorSMACross.create({
        data: this.toPrismaSMACross(indicator),
      }),
    )
  }

  async getSMACross(symbol: string): Promise<IndicatorSMACross | null> {
    const indicator = await this.prisma.indicatorSMACross.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!indicator) {
      return null
    }

    return this.toDomainSMACross(indicator)
  }

  async getGraphSMA(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorSMA[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const sma = await this.prisma.indicatorSMA.findMany({
      where: {
        symbol: symbol,
        created_at: {
          gte: startTime,
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    })

    return this.toDomainListSMA(sma)
  }

  async getGraphRSI(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorRSI[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const rsi = await this.prisma.indicatorRSI.findMany({
      where: {
        symbol: symbol,
        created_at: {
          gte: startTime,
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    })

    return this.toDomainListRSI(rsi)
  }

  async getGraphADX(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorADX[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const adx = await this.prisma.indicatorADX.findMany({
      where: {
        symbol: symbol,
        created_at: {
          gte: startTime,
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    })

    return this.toDomainListADX(adx)
  }

  async getGraphATR(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorATR[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const atr = await this.prisma.indicatorATR.findMany({
      where: {
        symbol: symbol,
        created_at: {
          gte: startTime,
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    })

    return this.toDomainListATR(atr)
  }

  async getGraphBB(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorBB[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const bb = await this.prisma.indicatorBB.findMany({
      where: {
        symbol: symbol,
        created_at: {
          gte: startTime,
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    })

    return this.toDomainListBB(bb)
  }

  async getGraphSMACross(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorSMACross[]> {
    const startTime: Date = getStartTimeFromTimeInterval(interval)

    const smaCross = await this.prisma.indicatorSMACross.findMany({
      where: {
        symbol: symbol,
        created_at: {
          gte: startTime,
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    })

    return this.toDomainListSMACross(smaCross)
  }

  private toPrismaSMA(
    indicatorSMACreate: IndicatorSMACreate,
  ): Prisma.IndicatorSMACreateInput {
    return prismaIndicatorSMASchema.parse(indicatorSMACreate)
  }

  private toPrismaRSI(
    indicatorRSICreate: IndicatorRSICreate,
  ): Prisma.IndicatorRSICreateInput {
    return prismaIndicatorRSISchema.parse(indicatorRSICreate)
  }

  private toPrismaATR(
    indicatorATRCreate: IndicatorATRCreate,
  ): Prisma.IndicatorATRCreateInput {
    return prismaIndicatorATRSchema.parse(indicatorATRCreate)
  }

  private toPrismaADX(
    indicatorADXCreate: IndicatorADXCreate,
  ): Prisma.IndicatorADXCreateInput {
    return prismaIndicatorADXSchema.parse(indicatorADXCreate)
  }

  private toPrismaBB(
    indicatorBBCreate: IndicatorBBCreate,
  ): Prisma.IndicatorBBCreateInput {
    return prismaIndicatorBBSchema.parse(indicatorBBCreate)
  }

  private toPrismaSMACross(
    indicatorSMACrossCreate: IndicatorSMACrossCreate,
  ): Prisma.IndicatorSMACrossCreateInput {
    return prismaIndicatorSMACrossSchema.parse(indicatorSMACrossCreate)
  }

  private toDomainSMA(prismaIndicatorSMA: PrismaIndicatorSMA): IndicatorSMA {
    return domainIndicatorSMASchema.parse(prismaIndicatorSMA)
  }

  private toDomainRSI(prismaIndicatorRSI: PrismaIndicatorRSI): IndicatorRSI {
    return domainIndicatorRSISchema.parse(prismaIndicatorRSI)
  }

  private toDomainATR(prismaIndicatorATR: PrismaIndicatorATR): IndicatorATR {
    return domainIndicatorATRSchema.parse(prismaIndicatorATR)
  }

  private toDomainADX(prismaIndicatorADX: PrismaIndicatorADX): IndicatorADX {
    return domainIndicatorADXSchema.parse(prismaIndicatorADX)
  }

  private toDomainBB(prismaIndicatorBB: PrismaIndicatorBB): IndicatorBB {
    return domainIndicatorBBSchema.parse(prismaIndicatorBB)
  }

  private toDomainSMACross(
    prismaIndicatorSMACross: PrismaIndicatorSMACross,
  ): IndicatorSMACross {
    return domainIndicatorSMACrossSchema.parse(prismaIndicatorSMACross)
  }

  private toDomainListSMA(prismaSMA: PrismaIndicatorSMA[]): IndicatorSMA[] {
    return prismaSMA.map(this.toDomainSMA)
  }

  private toDomainListRSI(prismaRSI: PrismaIndicatorRSI[]): IndicatorRSI[] {
    return prismaRSI.map(this.toDomainRSI)
  }

  private toDomainListADX(prismaADX: PrismaIndicatorADX[]): IndicatorADX[] {
    return prismaADX.map(this.toDomainADX)
  }

  private toDomainListATR(prismaATR: PrismaIndicatorATR[]): IndicatorATR[] {
    return prismaATR.map(this.toDomainATR)
  }

  private toDomainListBB(prismaBB: PrismaIndicatorBB[]): IndicatorBB[] {
    return prismaBB.map(this.toDomainBB)
  }

  private toDomainListSMACross(
    prismaSMACross: PrismaIndicatorSMACross[],
  ): IndicatorSMACross[] {
    return prismaSMACross.map(this.toDomainSMACross)
  }
}
