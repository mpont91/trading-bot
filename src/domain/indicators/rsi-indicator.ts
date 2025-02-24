import { RSI } from 'technicalindicators'
import { Kline } from '../types/kline'

export class RsiIndicator {
  constructor(private readonly period: number) {}

  calculate(klines: Kline[]): number {
    const values: number[] = RSI.calculate({
      period: this.period,
      values: klines.map((k: Kline) => k.closePrice),
    })

    return values[values.length - 1]
  }
}
