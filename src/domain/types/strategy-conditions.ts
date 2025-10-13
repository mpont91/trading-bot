import { z } from 'zod'

export const strategyBuyConditionsSchema = z.object({
  goldenCross: z.boolean().optional(),
  bullishTrend: z.boolean().optional(),
  oversold: z.boolean().optional(),
  stronglyOversold: z.boolean().optional(),
  extremelyOversold: z.boolean().optional(),
})

export const strategySellConditionsSchema = z.object({
  deathCross: z.boolean().optional(),
  bearishTrend: z.boolean().optional(),
  overbought: z.boolean().optional(),
  stronglyOverbought: z.boolean().optional(),
  extremelyOverbought: z.boolean().optional(),
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
