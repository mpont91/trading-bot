import { z } from 'zod'

export const backtestingSettingsSchema = z.object({
  initialEquity: z.number(),
  commissionRate: z.number(),
})

export const backtestingPositionSchema = z.object({
  entryPrice: z.number(),
  quantity: z.number(),
  tpPrice: z.number(),
  slPrice: z.number(),
  ts: z.number(),
  tsPrice: z.number().nullable(),
})

export const backtestingSummarySchema = z.object({
  initialEquity: z.number(),
  finalEquity: z.number(),
  fees: z.number(),
  trades: z.number().int(),
  success: z.number().int(),
  failed: z.number().int(),
  sell: z.number(),
  sl: z.number(),
  ts: z.number(),
  pnl: z.number(),
  net: z.number(),
  signalHold: z.number().int(),
  signalBuy: z.number().int(),
  signalSell: z.number().int(),
  buyConditions: z.record(z.string(), z.number()),
  sellConditions: z.record(z.string(), z.number()),
})

export type BacktestingSettings = z.infer<typeof backtestingSettingsSchema>
export type BacktestingPosition = z.infer<typeof backtestingPositionSchema>
export type BacktestingSummary = z.infer<typeof backtestingSummarySchema>
