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

export const strategyMeanReversionSchema = strategySettingsSchema.extend({
  buyScoreMin: z.number().int(),
  trailingStopMultiplier: z.number(),
  favorableEntryPriceMaxBB: z.number(),
  strongTrendMinADX: z.number().int(),
  bullishMomentumMinRSI: z.number().int(),
  bullishMomentumMaxRSI: z.number().int(),
  bearishMomentumMaxRSI: z.number().int(),
  bearishConvictionMinADX: z.number().int(),
})

export const strategySlowSwingSchema = strategySettingsSchema.extend({
  healthyDipMinRSI: z.number().int(),
  healthyDipMaxRSI: z.number().int(),
  trendStrengthMinADX: z.number().int(),
  stopsMultiplier: z.number(),
  trailingStopMultiplier: z.number(),
})

export const settingsSchema = z.object({
  intervalTradingTime: z.number().int(),
  intervalMarketTime: z.number().int(),
  intervalAccountTime: z.number().int(),
  binance: binanceSettingsSchema,
  maxPositionsOpened: z.number().int(),
  symbols: z.array(z.string()),
  safetyCapitalMargin: z.number(),
  strategies: z.object({
    meanReversion: strategyMeanReversionSchema,
    slowSwing: strategySlowSwingSchema,
  }),
})

export type BinanceSettings = z.infer<typeof binanceSettingsSchema>
export type IndicatorSettings = z.infer<typeof indicatorSettingsSchema>
export type StrategySettings = z.infer<typeof strategySettingsSchema>
export type StrategyMeanReversionSettings = z.infer<
  typeof strategyMeanReversionSchema
>
export type StrategySlowSwingSettings = z.infer<typeof strategySlowSwingSchema>
export type Settings = z.infer<typeof settingsSchema>
