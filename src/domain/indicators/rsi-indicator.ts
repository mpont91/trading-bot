import { RSI } from 'technicalindicators'
import { Kline } from '../types/kline'
import { IndicatorRSICreate } from '../models/indicator'

export class RsiIndicator {
  constructor(private readonly period: number) {}

  calculate(symbol: string, klines: Kline[]): IndicatorRSICreate {
    const values: number[] = RSI.calculate({
      period: this.period,
      values: klines.map((k: Kline) => k.closePrice),
    })

    return {
      period: this.period,
      symbol: symbol,
      price: klines[klines.length - 1].closePrice,
      rsi: values[values.length - 1],
    }
  }
}
