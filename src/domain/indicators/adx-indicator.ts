import { ADX } from 'technicalindicators'
import { Candle } from '../types/candle'
import { ADXOutput } from 'technicalindicators/declarations/directionalmovement/ADX'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'
import { Indicator, indicatorResultSchema } from './indicator'
import { z } from 'zod'

export const adxIndicatorResultSchema = z
  .object({
    period: z.number().int(),
    adx: z.number(),
    pdi: z.number(),
    mdi: z.number(),
  })
  .extend(indicatorResultSchema.shape)

export type AdxIndicatorResult = z.infer<typeof adxIndicatorResultSchema>

export class AdxIndicatorCalculator implements Indicator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, candles: Candle[]): AdxIndicatorResult {
    validateIndicatorCandles(this.period, candles.length)
    const values: ADXOutput[] = ADX.calculate({
      period: this.period,
      high: candles.map((k: Candle) => k.highPrice),
      low: candles.map((k: Candle) => k.lowPrice),
      close: candles.map((k: Candle) => k.closePrice),
    })

    validateIndicatorValues(values.length)

    const value: ADXOutput = values[values.length - 1]

    return {
      period: this.period,
      symbol: symbol,
      price: candles[candles.length - 1].closePrice,
      adx: value.adx,
      pdi: value.pdi,
      mdi: value.mdi,
    }
  }
}
