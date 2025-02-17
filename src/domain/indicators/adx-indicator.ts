import { ADX } from 'technicalindicators'
import { IndicatorEngine } from './indicator-engine'
import { Kline } from '../types/kline'
import { ADXOutput } from 'technicalindicators/declarations/directionalmovement/ADX'

export class AdxIndicator extends IndicatorEngine {
  getName(): string {
    return 'ADX'
  }
  getValue(period: number, klines: Kline[]): number {
    const values: ADXOutput[] = ADX.calculate({
      period: period,
      high: klines.map((k: Kline) => k.highPrice),
      low: klines.map((k: Kline) => k.lowPrice),
      close: klines.map((k: Kline) => k.closePrice),
    })

    const value: ADXOutput = values[values.length - 1]

    return value.adx
  }
}
