import { z } from 'zod'
import {
  IndicatorADX,
  IndicatorADXCreate,
  indicatorADXCreateSchema,
  IndicatorATR,
  IndicatorATRCreate,
  indicatorATRCreateSchema,
  IndicatorBB,
  IndicatorBBCreate,
  indicatorBBCreateSchema,
  IndicatorRSI,
  IndicatorRSICreate,
  indicatorRSICreateSchema,
  IndicatorSMA,
  IndicatorSMACreate,
  indicatorSMACreateSchema,
  IndicatorSMACross,
  IndicatorSMACrossCreate,
  indicatorSMACrossCreateSchema,
} from '../../../domain/models/indicator'
import Decimal from 'decimal.js'
import {
  Prisma,
  IndicatorSMA as PrismaIndicatorSMA,
  IndicatorRSI as PrismaIndicatorRSI,
  IndicatorADX as PrismaIndicatorADX,
  IndicatorATR as PrismaIndicatorATR,
  IndicatorBB as PrismaIndicatorBB,
  IndicatorSMACross as PrismaIndicatorSMACross,
} from '@prisma/client'

export const prismaIndicatorSMASchema = indicatorSMACreateSchema.transform(
  (indicatorSMACreate: IndicatorSMACreate) => {
    return {
      period: indicatorSMACreate.period,
      symbol: indicatorSMACreate.symbol,
      price: new Decimal(indicatorSMACreate.price),
      sma: new Decimal(indicatorSMACreate.sma),
    }
  },
)

export const prismaIndicatorRSISchema = indicatorRSICreateSchema.transform(
  (indicatorRSICreate: IndicatorRSICreate) => {
    return {
      period: indicatorRSICreate.period,
      symbol: indicatorRSICreate.symbol,
      price: new Decimal(indicatorRSICreate.price),
      rsi: new Decimal(indicatorRSICreate.rsi),
    }
  },
)

export const prismaIndicatorATRSchema = indicatorATRCreateSchema.transform(
  (indicatorATRCreate: IndicatorATRCreate) => {
    return {
      period: indicatorATRCreate.period,
      symbol: indicatorATRCreate.symbol,
      price: new Decimal(indicatorATRCreate.price),
      atr: new Decimal(indicatorATRCreate.atr),
    }
  },
)

export const prismaIndicatorADXSchema = indicatorADXCreateSchema.transform(
  (indicatorADXCreate: IndicatorADXCreate) => {
    return {
      period: indicatorADXCreate.period,
      symbol: indicatorADXCreate.symbol,
      price: new Decimal(indicatorADXCreate.price),
      adx: new Decimal(indicatorADXCreate.adx),
      pdi: new Decimal(indicatorADXCreate.pdi),
      mdi: new Decimal(indicatorADXCreate.mdi),
    }
  },
)

export const prismaIndicatorBBSchema = indicatorBBCreateSchema.transform(
  (indicatorBBCreate: IndicatorBBCreate) => {
    return {
      period: indicatorBBCreate.period,
      symbol: indicatorBBCreate.symbol,
      price: new Decimal(indicatorBBCreate.price),
      upper: new Decimal(indicatorBBCreate.upper),
      middle: new Decimal(indicatorBBCreate.middle),
      lower: new Decimal(indicatorBBCreate.lower),
      pb: new Decimal(indicatorBBCreate.pb),
    }
  },
)

export const prismaIndicatorSMACrossSchema =
  indicatorSMACrossCreateSchema.transform(
    (indicatorSMACrossCreate: IndicatorSMACrossCreate) => {
      return {
        period_long: indicatorSMACrossCreate.periodLong,
        period_short: indicatorSMACrossCreate.periodShort,
        symbol: indicatorSMACrossCreate.symbol,
        price: new Decimal(indicatorSMACrossCreate.price),
        sma_long: new Decimal(indicatorSMACrossCreate.smaLong),
        sma_short: new Decimal(indicatorSMACrossCreate.smaShort),
      }
    },
  )

export const domainIndicatorSMASchema = z
  .object({
    id: z.number().int(),
    period: z.number().int(),
    symbol: z.string(),
    price: z.instanceof(Prisma.Decimal),
    sma: z.instanceof(Prisma.Decimal),
    created_at: z.date(),
  })
  .transform(
    (prismaIndicatorSMA: PrismaIndicatorSMA): IndicatorSMA => ({
      id: prismaIndicatorSMA.id,
      period: prismaIndicatorSMA.period,
      symbol: prismaIndicatorSMA.symbol,
      price: prismaIndicatorSMA.price.toNumber(),
      sma: prismaIndicatorSMA.sma.toNumber(),
      createdAt: prismaIndicatorSMA.created_at,
    }),
  )

export const domainIndicatorRSISchema = z
  .object({
    id: z.number().int(),
    period: z.number().int(),
    symbol: z.string(),
    price: z.instanceof(Prisma.Decimal),
    rsi: z.instanceof(Prisma.Decimal),
    created_at: z.date(),
  })
  .transform(
    (prismaIndicatorRSI: PrismaIndicatorRSI): IndicatorRSI => ({
      id: prismaIndicatorRSI.id,
      period: prismaIndicatorRSI.period,
      symbol: prismaIndicatorRSI.symbol,
      price: prismaIndicatorRSI.price.toNumber(),
      rsi: prismaIndicatorRSI.rsi.toNumber(),
      createdAt: prismaIndicatorRSI.created_at,
    }),
  )

export const domainIndicatorATRSchema = z
  .object({
    id: z.number().int(),
    period: z.number().int(),
    symbol: z.string(),
    price: z.instanceof(Prisma.Decimal),
    atr: z.instanceof(Prisma.Decimal),
    created_at: z.date(),
  })
  .transform(
    (prismaIndicatorATR: PrismaIndicatorATR): IndicatorATR => ({
      id: prismaIndicatorATR.id,
      period: prismaIndicatorATR.period,
      symbol: prismaIndicatorATR.symbol,
      price: prismaIndicatorATR.price.toNumber(),
      atr: prismaIndicatorATR.atr.toNumber(),
      createdAt: prismaIndicatorATR.created_at,
    }),
  )

export const domainIndicatorADXSchema = z
  .object({
    id: z.number().int(),
    period: z.number().int(),
    symbol: z.string(),
    price: z.instanceof(Prisma.Decimal),
    adx: z.instanceof(Prisma.Decimal),
    pdi: z.instanceof(Prisma.Decimal),
    mdi: z.instanceof(Prisma.Decimal),
    created_at: z.date(),
  })
  .transform(
    (prismaIndicatorADX: PrismaIndicatorADX): IndicatorADX => ({
      id: prismaIndicatorADX.id,
      period: prismaIndicatorADX.period,
      symbol: prismaIndicatorADX.symbol,
      price: prismaIndicatorADX.price.toNumber(),
      adx: prismaIndicatorADX.adx.toNumber(),
      pdi: prismaIndicatorADX.pdi.toNumber(),
      mdi: prismaIndicatorADX.mdi.toNumber(),
      createdAt: prismaIndicatorADX.created_at,
    }),
  )

export const domainIndicatorBBSchema = z
  .object({
    id: z.number().int(),
    period: z.number().int(),
    symbol: z.string(),
    price: z.instanceof(Prisma.Decimal),
    upper: z.instanceof(Prisma.Decimal),
    middle: z.instanceof(Prisma.Decimal),
    lower: z.instanceof(Prisma.Decimal),
    pb: z.instanceof(Prisma.Decimal),
    created_at: z.date(),
  })
  .transform(
    (prismaIndicatorBB: PrismaIndicatorBB): IndicatorBB => ({
      id: prismaIndicatorBB.id,
      period: prismaIndicatorBB.period,
      symbol: prismaIndicatorBB.symbol,
      price: prismaIndicatorBB.price.toNumber(),
      upper: prismaIndicatorBB.upper.toNumber(),
      middle: prismaIndicatorBB.middle.toNumber(),
      lower: prismaIndicatorBB.lower.toNumber(),
      pb: prismaIndicatorBB.pb.toNumber(),
      createdAt: prismaIndicatorBB.created_at,
    }),
  )

export const domainIndicatorSMACrossSchema = z
  .object({
    id: z.number().int(),
    period_long: z.number().int(),
    period_short: z.number().int(),
    symbol: z.string(),
    price: z.instanceof(Prisma.Decimal),
    sma_long: z.instanceof(Prisma.Decimal),
    sma_short: z.instanceof(Prisma.Decimal),
    created_at: z.date(),
  })
  .transform(
    (prismaIndicatorSMACross: PrismaIndicatorSMACross): IndicatorSMACross => ({
      id: prismaIndicatorSMACross.id,
      periodLong: prismaIndicatorSMACross.period_long,
      periodShort: prismaIndicatorSMACross.period_short,
      symbol: prismaIndicatorSMACross.symbol,
      price: prismaIndicatorSMACross.price.toNumber(),
      smaLong: prismaIndicatorSMACross.sma_long.toNumber(),
      smaShort: prismaIndicatorSMACross.sma_short.toNumber(),
      createdAt: prismaIndicatorSMACross.created_at,
    }),
  )
