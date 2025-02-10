import { RSI } from 'technicalindicators'
import { Indicator } from './indicator'
import { Kline } from '../types/kline'

export class RsiIndicator extends Indicator {
  getName(): string {
    return 'RSI'
  }
  getValue(period: number, klines: Kline[]): number {
    const values: number[] = RSI.calculate({
      period: period,
      values: klines.map((k: Kline) => k.closePrice),
    })

    return values[values.length - 1]
  }
}
