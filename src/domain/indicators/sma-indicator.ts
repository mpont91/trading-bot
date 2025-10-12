import { SMA } from 'technicalindicators'
import { Candle } from '../types/candle'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'
import { z } from 'zod'
import { Indicator, indicatorResultSchema } from './indicator'

export const smaIndicatorResultSchema = z
  .object({
    period: z.number().int(),
    sma: z.number(),
  })
  .extend(indicatorResultSchema.shape)

export type SmaIndicatorResult = z.infer<typeof smaIndicatorResultSchema>

export class SmaIndicatorCalculator implements Indicator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, candles: Candle[]): SmaIndicatorResult {
    validateIndicatorCandles(this.period, candles.length)

    const values: number[] = SMA.calculate({
      period: this.period,
      values: candles.map((k: Candle) => k.closePrice),
    })

    validateIndicatorValues(values.length)

    return {
      period: this.period,
      symbol: symbol,
      price: candles[candles.length - 1].closePrice,
      sma: values[values.length - 1],
    }
  }
}
