import { SMA } from 'technicalindicators'
import { Candle } from '../types/candle'
import { IndicatorSMACreate } from '../models/indicator'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class SmaIndicatorCalculator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, candles: Candle[]): IndicatorSMACreate {
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
