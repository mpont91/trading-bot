import { RSI } from 'technicalindicators'
import { Candle } from '../types/candle'
import { IndicatorRSICreate } from '../models/indicator'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class RsiIndicatorCalculator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, candles: Candle[]): IndicatorRSICreate {
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
