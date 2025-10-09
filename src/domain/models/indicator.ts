import { z } from 'zod'

const indicatorSchema = z.object({
  id: z.number().int(),
  symbol: z.string(),
  price: z.number(),
  createdAt: z.date(),
})

export const indicatorSMASchema = z
  .object({
    period: z.number().int(),
    sma: z.number(),
  })
  .extend(indicatorSchema.shape)

export const indicatorSMACreateSchema = indicatorSMASchema.omit({
  id: true,
  createdAt: true,
})

export const indicatorRSISchema = z
  .object({
    period: z.number().int(),
    rsi: z.number(),
  })
  .extend(indicatorSchema.shape)

export const indicatorRSICreateSchema = indicatorRSISchema.omit({
  id: true,
  createdAt: true,
})

export const indicatorATRSchema = z
  .object({
    period: z.number().int(),
    atr: z.number(),
  })
  .extend(indicatorSchema.shape)

export const indicatorATRCreateSchema = indicatorATRSchema.omit({
  id: true,
  createdAt: true,
})

export const indicatorADXSchema = z
  .object({
    period: z.number().int(),
    adx: z.number(),
    pdi: z.number(),
    mdi: z.number(),
  })
  .extend(indicatorSchema.shape)

export const indicatorADXCreateSchema = indicatorADXSchema.omit({
  id: true,
  createdAt: true,
})

export const indicatorBBSchema = z
  .object({
    period: z.number().int(),
    upper: z.number(),
    middle: z.number(),
    lower: z.number(),
    pb: z.number(),
  })
  .extend(indicatorSchema.shape)

export const indicatorBBCreateSchema = indicatorBBSchema.omit({
  id: true,
  createdAt: true,
})

export const indicatorBBDoubleSchema = z
  .object({
    periodInner: z.number().int(),
    periodOuter: z.number().int(),
    stdDevInner: z.number(),
    stdDevOuter: z.number(),
    upperInner: z.number(),
    middleInner: z.number(),
    lowerInner: z.number(),
    pbInner: z.number(),
    upperOuter: z.number(),
    middleOuter: z.number(),
    lowerOuter: z.number(),
    pbOuter: z.number(),
  })
  .extend(indicatorSchema.shape)

export const indicatorBBDoubleCreateSchema = indicatorBBDoubleSchema.omit({
  id: true,
  createdAt: true,
})

export const indicatorSMACrossSchema = z
  .object({
    periodLong: z.number().int(),
    periodShort: z.number().int(),
    smaLong: z.number(),
    smaShort: z.number(),
  })
  .extend(indicatorSchema.shape)

export const indicatorSMACrossCreateSchema = indicatorSMACrossSchema.omit({
  id: true,
  createdAt: true,
})

export const indicatorListSchema = z.object({
  sma: indicatorSMASchema,
  rsi: indicatorRSISchema,
  atr: indicatorATRSchema,
  adx: indicatorADXSchema,
  bb: indicatorBBSchema,
  smaCross: indicatorSMACrossSchema,
})

export const indicatorListCreateSchema = z.object({
  sma: indicatorSMACreateSchema,
  rsi: indicatorRSICreateSchema,
  atr: indicatorATRCreateSchema,
  adx: indicatorADXCreateSchema,
  bb: indicatorBBCreateSchema,
  smaCross: indicatorSMACrossCreateSchema,
})

export enum IndicatorName {
  SMA = 'sma',
  RSI = 'rsi',
  ATR = 'atr',
  ADX = 'adx',
  BB = 'bb',
  SMACROSS = 'smacross',
}

export const indicatorNameSchema = z.enum(IndicatorName)

export type IndicatorSMA = z.infer<typeof indicatorSMASchema>
export type IndicatorSMACreate = z.infer<typeof indicatorSMACreateSchema>
export type IndicatorRSI = z.infer<typeof indicatorRSISchema>
export type IndicatorRSICreate = z.infer<typeof indicatorRSICreateSchema>
export type IndicatorATR = z.infer<typeof indicatorATRSchema>
export type IndicatorATRCreate = z.infer<typeof indicatorATRCreateSchema>
export type IndicatorADX = z.infer<typeof indicatorADXSchema>
export type IndicatorADXCreate = z.infer<typeof indicatorADXCreateSchema>
export type IndicatorBB = z.infer<typeof indicatorBBSchema>
export type IndicatorBBCreate = z.infer<typeof indicatorBBCreateSchema>
export type IndicatorBBDouble = z.infer<typeof indicatorBBDoubleSchema>
export type IndicatorBBDoubleCreate = z.infer<
  typeof indicatorBBDoubleCreateSchema
>
export type IndicatorSMACross = z.infer<typeof indicatorSMACrossSchema>
export type IndicatorSMACrossCreate = z.infer<
  typeof indicatorSMACrossCreateSchema
>
export type IndicatorList = z.infer<typeof indicatorListSchema>
export type IndicatorListCreate = z.infer<typeof indicatorListCreateSchema>
