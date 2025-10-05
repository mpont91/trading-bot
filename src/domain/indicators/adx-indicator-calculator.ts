import { ADX } from 'technicalindicators'
import { Candle } from '../types/Candle'
import { ADXOutput } from 'technicalindicators/declarations/directionalmovement/ADX'
import { IndicatorADXCreate } from '../models/indicator'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class AdxIndicatorCalculator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, candles: Candle[]): IndicatorADXCreate {
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
