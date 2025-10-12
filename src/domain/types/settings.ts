import { z } from 'zod'

export const binanceSettingsSchema = z.object({
  binanceApiKey: z.string(),
  binanceApiSecret: z.string(),
  bottleneckMaxConcurrent: z.number().int(),
  bottleneckMinTime: z.number().int(),
  baseCurrency: z.string(),
  feeCurrency: z.string(),
})

export const settingsSchema = z.object({
  intervalTradingTime: z.number().int(),
  intervalMarketTime: z.number().int(),
  intervalAccountTime: z.number().int(),
  binance: binanceSettingsSchema,
  maxPositionsOpened: z.number().int(),
  symbols: z.array(z.string()),
  safetyCapitalMargin: z.number(),
})

export type BinanceSettings = z.infer<typeof binanceSettingsSchema>
export type Settings = z.infer<typeof settingsSchema>
