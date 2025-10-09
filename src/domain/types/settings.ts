import { z } from 'zod'
import { timeFrameSchema } from './candle'

export const binanceSettingsSchema = z.object({
  binanceApiKey: z.string(),
  binanceApiSecret: z.string(),
  bottleneckMaxConcurrent: z.number().int(),
  bottleneckMinTime: z.number().int(),
  baseCurrency: z.string(),
  feeCurrency: z.string(),
})

export const indicatorSettingsSchema = z.object({
  adx: z.number().int(),
  atr: z.number().int(),
  rsi: z.number().int(),
  sma: z.number().int(),
  bb: z.object({
    period: z.number().int(),
    multiplier: z.number(),
  }),
  smaCross: z.object({
    periodLong: z.number().int(),
    periodShort: z.number().int(),
  }),
})

export const strategySettingsSchema = z.object({
  indicators: indicatorSettingsSchema,
  candles: z.number().int(),
  timeFrame: timeFrameSchema,
})

export const strategySMACrossSimpleSchema = strategySettingsSchema.extend({
  tp: z.number(),
  sl: z.number(),
  ts: z.number(),
})

export const settingsSchema = z.object({
  intervalTradingTime: z.number().int(),
  intervalMarketTime: z.number().int(),
  intervalAccountTime: z.number().int(),
  binance: binanceSettingsSchema,
  maxPositionsOpened: z.number().int(),
  symbols: z.array(z.string()),
  safetyCapitalMargin: z.number(),
  strategy: z.string(),
  strategies: z.object({
    smaCrossSimple: strategySMACrossSimpleSchema,
  }),
})

export type BinanceSettings = z.infer<typeof binanceSettingsSchema>
export type IndicatorSettings = z.infer<typeof indicatorSettingsSchema>
export type StrategySettings = z.infer<typeof strategySettingsSchema>
export type StrategySMACrossSimpleSettings = z.infer<
  typeof strategySMACrossSimpleSchema
>
export type Settings = z.infer<typeof settingsSchema>
