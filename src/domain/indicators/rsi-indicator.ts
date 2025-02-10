import { RSI } from 'technicalindicators'
import { IndicatorService } from '../services/indicator-service'
import { Kline } from '../types/kline'

export class RsiIndicator extends IndicatorService {
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
