import { SMA } from 'technicalindicators'
import { Kline } from '../types/kline'
import { IndicatorSMACrossCreate } from '../models/indicator'
import {
  validateIndicatorKlines,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class SmaCrossIndicator {
  constructor(
    private readonly periodLong: number,
    private readonly periodShort: number,
  ) {}

  calculate(symbol: string, klines: Kline[]): IndicatorSMACrossCreate {
    validateIndicatorKlines(this.periodLong, klines.length)

    const valuesLong: number[] = SMA.calculate({
      period: this.periodLong,
      values: klines.map((k: Kline) => k.closePrice),
    })

    validateIndicatorValues(valuesLong.length)

    const valuesShort: number[] = SMA.calculate({
      period: this.periodShort,
      values: klines.map((k: Kline) => k.closePrice),
    })

    validateIndicatorValues(valuesShort.length)

    return {
      periodLong: this.periodLong,
      periodShort: this.periodShort,
      symbol: symbol,
      price: klines[klines.length - 1].closePrice,
      smaLong: valuesLong[valuesLong.length - 1],
      smaShort: valuesShort[valuesShort.length - 1],
    }
  }
}
