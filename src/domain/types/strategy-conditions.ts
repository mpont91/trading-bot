import { z } from 'zod'

export const strategyBuyConditionsSchema = z.object({
  movingAverageCrossoverGoldenCross: z.boolean().optional(),
  movingAverageCrossoverBullishTrend: z.boolean().optional(),
  momentumOscillatorOversold: z.boolean().optional(),
  momentumOscillatorStronglyOversold: z.boolean().optional(),
  momentumOscillatorExtremelyOversold: z.boolean().optional(),
  bollingerBandDoubleBollingerBandBuy: z.boolean().optional(),
  bollingerBandMomentumBuy: z.boolean().optional(),
  bollingerBandSqueezeBuy: z.boolean().optional(),
})

export const strategySellConditionsSchema = z.object({
  movingAverageCrossoverDeathCross: z.boolean().optional(),
  movingAverageCrossoverBearishTrend: z.boolean().optional(),
  momentumOscillatorOverbought: z.boolean().optional(),
  momentumOscillatorStronglyOverbought: z.boolean().optional(),
  momentumOscillatorExtremelyOverbought: z.boolean().optional(),
  bollingerBandDoubleBollingerBandSell: z.boolean().optional(),
  bollingerBandUpperSell: z.boolean().optional(),
  bollingerBandMiddleSell: z.boolean().optional(),
  bollingerBandLowerSell: z.boolean().optional(),
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
