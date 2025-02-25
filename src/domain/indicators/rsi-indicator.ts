import { RSI } from 'technicalindicators'
import { Kline } from '../types/kline'
import { IndicatorRSICreate } from '../models/indicator'
import {
  validateIndicatorKlines,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class RsiIndicator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, klines: Kline[]): IndicatorRSICreate {
    validateIndicatorKlines(this.period, klines.length)

    const values: number[] = RSI.calculate({
      period: this.period,
      values: klines.map((k: Kline) => k.closePrice),
    })

    validateIndicatorValues(values.length)

    return {
      period: this.period,
      symbol: symbol,
      price: klines[klines.length - 1].closePrice,
      rsi: values[values.length - 1],
    }
  }
}
