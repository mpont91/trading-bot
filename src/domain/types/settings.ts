import { z } from 'zod'

export const binanceSettingsSchema = z.object({
  binanceApiKey: z.string(),
  binanceApiSecret: z.string(),
  bottleneckMaxConcurrent: z.number().int(),
  bottleneckMinTime: z.number().int(),
  baseCurrency: z.string(),
  feeCurrency: z.string(),
})

export const indicatorsSettingsSchema = z.object({
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

export const strategyMeanReversionSchema = z.object({
  buyScoreMin: z.number().int(),
  favorableEntryPriceMaxBB: z.number().int(),
  strongTrendMinADX: z.number().int(),
  bullishMomentumMinRSI: z.number().int(),
  bullishMomentumMaxRSI: z.number().int(),
  bearishMomentumMaxRSI: z.number().int(),
  bearishConvictionMinADX: z.number().int(),
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
  indicators: indicatorsSettingsSchema,
  strategyMeanReversion: strategyMeanReversionSchema,
})

export type BinanceSettings = z.infer<typeof binanceSettingsSchema>
export type IndicatorsSettings = z.infer<typeof indicatorsSettingsSchema>
export type StrategyMeanReversion = z.infer<typeof strategyMeanReversionSchema>
export type Settings = z.infer<typeof settingsSchema>
