import { BollingerBands } from 'technicalindicators'
import { Candle } from '../types/candle'
import { BollingerBandsOutput } from 'technicalindicators/declarations/generated'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'
import { Indicator, indicatorResultSchema } from './indicator'
import { z } from 'zod'

export const bbIndicatorResultSchema = z
  .object({
    period: z.number().int(),
    stdDev: z.number(),
    upper: z.number(),
    middle: z.number(),
    lower: z.number(),
    pb: z.number(),
  })
  .extend(indicatorResultSchema.shape)

export type BbIndicatorResult = z.infer<typeof bbIndicatorResultSchema>

export class BbIndicatorCalculator implements Indicator {
  constructor(
    private readonly period: number,
    private readonly stdDev: number,
  ) {}

  calculate(symbol: string, candles: Candle[]): BbIndicatorResult {
    validateIndicatorCandles(this.period, candles.length)
    const values: BollingerBandsOutput[] = BollingerBands.calculate({
      period: this.period,
      stdDev: this.stdDev,
      values: candles.map((k: Candle) => k.closePrice),
    })

    const value: BollingerBandsOutput = values[values.length - 1]

    validateIndicatorValues(values.length)

    return {
      period: this.period,
      stdDev: this.stdDev,
      symbol: symbol,
      price: candles[candles.length - 1].closePrice,
      upper: value.upper,
      middle: value.middle,
      lower: value.lower,
      pb: value.pb,
    }
  }
}
