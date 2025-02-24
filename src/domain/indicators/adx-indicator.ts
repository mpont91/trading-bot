import { ADX } from 'technicalindicators'
import { Kline } from '../types/kline'
import { ADXOutput } from 'technicalindicators/declarations/directionalmovement/ADX'
import { AdxIndicatorType } from '../models/indicator'

export class AdxIndicator {
  constructor(private readonly period: number) {}
  calculate(klines: Kline[]): AdxIndicatorType {
    const values: ADXOutput[] = ADX.calculate({
      period: this.period,
      high: klines.map((k: Kline) => k.highPrice),
      low: klines.map((k: Kline) => k.lowPrice),
      close: klines.map((k: Kline) => k.closePrice),
    })

    return this.toDomain(values[values.length - 1])
  }

  private toDomain(value: ADXOutput): AdxIndicatorType {
    return {
      adx: value.adx,
      pdi: value.pdi,
      mdi: value.mdi,
    }
  }
}
