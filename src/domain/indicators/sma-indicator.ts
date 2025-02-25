import { SMA } from 'technicalindicators'
import { Kline } from '../types/kline'
import { IndicatorSMACreate } from '../models/indicator'
import {
  validateIndicatorKlines,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class SmaIndicator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, klines: Kline[]): IndicatorSMACreate {
    validateIndicatorKlines(this.period, klines.length)

    const values: number[] = SMA.calculate({
      period: this.period,
      values: klines.map((k: Kline) => k.closePrice),
    })

    validateIndicatorValues(values.length)

    return {
      period: this.period,
      symbol: symbol,
      price: klines[klines.length - 1].closePrice,
      sma: values[values.length - 1],
    }
  }
}
