import { SMA } from 'technicalindicators'
import { Kline } from '../types/kline'

export class SmaIndicator {
  constructor(private readonly period: number) {}

  calculate(klines: Kline[]): number {
    const values: number[] = SMA.calculate({
      period: this.period,
      values: klines.map((k: Kline) => k.closePrice),
    })

    return values[values.length - 1]
  }
}
