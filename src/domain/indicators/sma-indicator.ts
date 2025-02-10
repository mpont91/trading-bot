import { SMA } from 'technicalindicators'
import { Indicator } from './indicator'
import { Kline } from '../types/kline'

export class SmaIndicator extends Indicator {
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
