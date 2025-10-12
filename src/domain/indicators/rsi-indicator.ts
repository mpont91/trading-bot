import { RSI } from 'technicalindicators'
import { Candle } from '../types/candle'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'
import { z } from 'zod'
import { Indicator, indicatorResultSchema } from './indicator'

export const rsiIndicatorResultSchema = z
  .object({
    period: z.number().int(),
    rsi: z.number(),
  })
  .extend(indicatorResultSchema.shape)

export type RsiIndicatorResult = z.infer<typeof rsiIndicatorResultSchema>

export class RsiIndicatorCalculator implements Indicator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, candles: Candle[]): RsiIndicatorResult {
    validateIndicatorCandles(this.period, candles.length)

    const values: number[] = RSI.calculate({
      period: this.period,
      values: candles.map((k: Candle) => k.closePrice),
    })

    validateIndicatorValues(values.length)

    return {
      period: this.period,
      symbol: symbol,
      price: candles[candles.length - 1].closePrice,
      rsi: values[values.length - 1],
    }
  }
}
