import { z } from 'zod'

export const strategyMeanReversionBuyConditionsSchema = z.object({
  trendUp: z.boolean().optional(),
  goldenCross: z.boolean().optional(),
  strongTrend: z.boolean().optional(),
  bullishDirection: z.boolean().optional(),
  bullishMomentum: z.boolean().optional(),
  notOverextended: z.boolean().optional(),
  favorableEntryPrice: z.boolean().optional(),
})

export const strategyMeanReversionSellConditionsSchema = z.object({
  deathCross: z.boolean().optional(),
  bearishMomentum: z.boolean().optional(),
  trendWeakening: z.boolean().optional(),
  bearishConviction: z.boolean().optional(),
})

export const strategySlowSwingBuyConditionsSchema = z.object({
  bullMarket: z.boolean().optional(),
  healthyDip: z.boolean().optional(),
  trendStrength: z.boolean().optional(),
})

export const strategySlowSwingSellConditionsSchema = z.object({
  supportBroken: z.boolean().optional(),
})

export const strategyBuyConditionsSchema = z
  .object({})
  .extend(strategyMeanReversionBuyConditionsSchema.shape)
  .extend(strategySlowSwingBuyConditionsSchema.shape)

export const strategySellConditionsSchema = z
  .object({})
  .extend(strategyMeanReversionSellConditionsSchema.shape)
  .extend(strategySlowSwingSellConditionsSchema.shape)

export const strategyConditionsSchema = z.object({
  buy: strategyBuyConditionsSchema,
  sell: strategySellConditionsSchema,
})

export type StrategyBuyConditions = z.infer<typeof strategyBuyConditionsSchema>
export type StrategySellConditions = z.infer<
  typeof strategySellConditionsSchema
>
export type StrategyConditions = z.infer<typeof strategyConditionsSchema>
