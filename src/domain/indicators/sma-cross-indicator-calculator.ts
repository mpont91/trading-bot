import { SMA } from 'technicalindicators'
import { Candle } from '../types/candle'
import { IndicatorSMACrossCreate } from '../models/indicator'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class SmaCrossIndicatorCalculator {
  constructor(
    private readonly periodLong: number,
    private readonly periodShort: number,
  ) {}

  calculate(symbol: string, candles: Candle[]): IndicatorSMACrossCreate {
    validateIndicatorCandles(this.periodLong, candles.length)

    const valuesLong: number[] = SMA.calculate({
      period: this.periodLong,
      values: candles.map((k: Candle) => k.closePrice),
    })

    validateIndicatorValues(valuesLong.length)

    const valuesShort: number[] = SMA.calculate({
      period: this.periodShort,
      values: candles.map((k: Candle) => k.closePrice),
    })

    validateIndicatorValues(valuesShort.length)

    return {
      periodLong: this.periodLong,
      periodShort: this.periodShort,
      symbol: symbol,
      price: candles[candles.length - 1].closePrice,
      smaLong: valuesLong[valuesLong.length - 1],
      smaShort: valuesShort[valuesShort.length - 1],
    }
  }
}
