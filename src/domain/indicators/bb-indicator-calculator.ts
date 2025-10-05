import { BollingerBands } from 'technicalindicators'
import { Candle } from '../types/candle'
import { BollingerBandsOutput } from 'technicalindicators/declarations/generated'
import { IndicatorBBCreate } from '../models/indicator'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class BbIndicatorCalculator {
  constructor(
    private readonly period: number,
    private readonly multiplier: number,
  ) {}

  calculate(symbol: string, candles: Candle[]): IndicatorBBCreate {
    validateIndicatorCandles(this.period, candles.length)
    const values: BollingerBandsOutput[] = BollingerBands.calculate({
      period: this.period,
      stdDev: this.multiplier,
      values: candles.map((k: Candle) => k.closePrice),
    })

    const value: BollingerBandsOutput = values[values.length - 1]

    validateIndicatorValues(values.length)

    return {
      period: this.period,
      symbol: symbol,
      price: candles[candles.length - 1].closePrice,
      upper: value.upper,
      middle: value.middle,
      lower: value.lower,
      pb: value.pb,
    }
  }
}
