import { ATR } from 'technicalindicators'
import { Candle } from '../types/candle'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'
import { Indicator, indicatorResultSchema } from './indicator'
import { z } from 'zod'

export const atrIndicatorResultSchema = z
  .object({
    period: z.number().int(),
    atr: z.number(),
  })
  .extend(indicatorResultSchema.shape)

export type AtrIndicatorResult = z.infer<typeof atrIndicatorResultSchema>

export class AtrIndicatorCalculator implements Indicator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, candles: Candle[]): AtrIndicatorResult {
    validateIndicatorCandles(this.period, candles.length)
    const values: number[] = ATR.calculate({
      period: this.period,
      high: candles.map((k: Candle) => k.highPrice),
      low: candles.map((k: Candle) => k.lowPrice),
      close: candles.map((k: Candle) => k.closePrice),
    })

    validateIndicatorValues(values.length)

    return {
      period: this.period,
      symbol: symbol,
      price: candles[candles.length - 1].closePrice,
      atr: values[values.length - 1],
    }
  }
}
