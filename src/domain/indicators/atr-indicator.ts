import { ATR } from 'technicalindicators'
import { Candle } from '../types/Candle'
import { IndicatorATRCreate } from '../models/indicator'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class AtrIndicator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, candles: Candle[]): IndicatorATRCreate {
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
