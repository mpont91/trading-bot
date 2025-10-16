import { z } from 'zod'

export const strategyBuyConditionsSchema = z.object({
  MovingAverageCrossoverGoldenCross: z.boolean().optional(),
  MovingAverageCrossoverBullishTrend: z.boolean().optional(),
  MomentumOscillatorOversold: z.boolean().optional(),
  MomentumOscillatorStronglyOversold: z.boolean().optional(),
  MomentumOscillatorExtremelyOversold: z.boolean().optional(),
  BollingerBandDoubleBollingerBandBuy: z.boolean().optional(),
  BollingerBandMomentumBuy: z.boolean().optional(),
  BollingerBandSqueezeBuy: z.boolean().optional(),
})

export const strategySellConditionsSchema = z.object({
  MovingAverageCrossoverDeathCross: z.boolean().optional(),
  MovingAverageCrossoverBearishTrend: z.boolean().optional(),
  MomentumOscillatorOverbought: z.boolean().optional(),
  MomentumOscillatorStronglyOverbought: z.boolean().optional(),
  MomentumOscillatorExtremelyOverbought: z.boolean().optional(),
  BollingerBandDoubleBollingerBandSell: z.boolean().optional(),
  BollingerBandMomentumSell: z.boolean().optional(),
  BollingerBandSqueezeSell: z.boolean().optional(),
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
