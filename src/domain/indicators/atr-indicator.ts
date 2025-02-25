import { ATR } from 'technicalindicators'
import { Kline } from '../types/kline'
import { IndicatorATRCreate } from '../models/indicator'
import {
  validateIndicatorKlines,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class AtrIndicator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, klines: Kline[]): IndicatorATRCreate {
    validateIndicatorKlines(this.period, klines.length)
    const values: number[] = ATR.calculate({
      period: this.period,
      high: klines.map((k: Kline) => k.highPrice),
      low: klines.map((k: Kline) => k.lowPrice),
      close: klines.map((k: Kline) => k.closePrice),
    })

    validateIndicatorValues(values.length)

    return {
      period: this.period,
      symbol: symbol,
      price: klines[klines.length - 1].closePrice,
      atr: values[values.length - 1],
    }
  }
}
