import { SMA } from 'technicalindicators'
import { IndicatorService } from '../services/indicator-service'
import { Kline } from '../types/kline'

export class SmaIndicator extends IndicatorService {
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
