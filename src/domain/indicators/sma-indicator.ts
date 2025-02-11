import { SMA } from 'technicalindicators'
import { IndicatorEngine } from './indicator-engine'
import { Kline } from '../types/kline'

export class SmaIndicator extends IndicatorEngine {
  getName(): string {
    return 'SMA'
  }
  getValue(period: number, klines: Kline[]): number {
    const values: number[] = SMA.calculate({
      period: period,
      values: klines.map((k: Kline) => k.closePrice),
    })

    return values[values.length - 1]
  }
}
