import { ATR } from 'technicalindicators'
import { IndicatorEngine } from './indicator-engine'
import { Kline } from '../types/kline'

export class AtrIndicator extends IndicatorEngine {
  getName(): string {
    return 'ATR'
  }
  getValue(period: number, klines: Kline[]): number {
    const values: number[] = ATR.calculate({
      period: period,
      high: klines.map((k: Kline) => k.highPrice),
      low: klines.map((k: Kline) => k.lowPrice),
      close: klines.map((k: Kline) => k.closePrice),
    })

    return values[values.length - 1]
  }
}
