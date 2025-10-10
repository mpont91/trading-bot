import { z } from 'zod'

export const strategySMACrossSimpleBuyConditionsSchema = z.object({
  bullMarket: z.boolean().optional(),
})

export const strategySMACrossSimpleSellConditionsSchema = z.object({
  bearMarket: z.boolean().optional(),
})

export const strategyBBDoubleBuyConditionsSchema = z.object({
  buyZone: z.boolean().optional(),
  trendStrength: z.boolean().optional(),
})

export const strategyBBDoubleSellConditionsSchema = z.object({
  momentumLost: z.boolean().optional(),
})

export const strategyBuyConditionsSchema = z
  .object({})
  .extend(strategySMACrossSimpleBuyConditionsSchema.shape)
  .extend(strategyBBDoubleBuyConditionsSchema.shape)

export const strategySellConditionsSchema = z
  .object({})
  .extend(strategySMACrossSimpleSellConditionsSchema.shape)
  .extend(strategyBBDoubleSellConditionsSchema.shape)

export const strategyConditionsSchema = z.object({
  buy: strategyBuyConditionsSchema,
  sell: strategySellConditionsSchema,
})

export type StrategyBuyConditions = z.infer<typeof strategyBuyConditionsSchema>
export type StrategySellConditions = z.infer<
  typeof strategySellConditionsSchema
>
export type StrategyConditions = z.infer<typeof strategyConditionsSchema>
