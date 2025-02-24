import { ATR } from 'technicalindicators'
import { Kline } from '../types/kline'

export class AtrIndicator {
  constructor(private readonly period: number) {}

  calculate(klines: Kline[]): number {
    const values: number[] = ATR.calculate({
      period: this.period,
      high: klines.map((k: Kline) => k.highPrice),
      low: klines.map((k: Kline) => k.lowPrice),
      close: klines.map((k: Kline) => k.closePrice),
    })

    return values[values.length - 1]
  }
}
