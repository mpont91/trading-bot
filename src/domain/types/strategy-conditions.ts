import { z } from 'zod'

export const strategyBuyConditionsSchema = z.object({
  trendUp: z.boolean().optional(),
  goldenCross: z.boolean().optional(),
  strongTrend: z.boolean().optional(),
  bullishDirection: z.boolean().optional(),
  bullishMomentum: z.boolean().optional(),
  notOverextended: z.boolean().optional(),
  favorableEntryPrice: z.boolean().optional(),
})

export const strategySellConditionsSchema = z.object({
  deathCross: z.boolean().optional(),
  bearishMomentum: z.boolean().optional(),
  trendWeakening: z.boolean().optional(),
  bearishConviction: z.boolean().optional(),
})

export const strategyConditionsSchema = z.object({
  buy: strategyBuyConditionsSchema,
  sell: strategySellConditionsSchema,
})

export type StrategyBuyConditions = z.infer<typeof strategyBuyConditionsSchema>
export type StrategySellConditions = z.infer<
  typeof strategySellConditionsSchema
>
export type StrategyConditions = z.infer<typeof strategyConditionsSchema>
