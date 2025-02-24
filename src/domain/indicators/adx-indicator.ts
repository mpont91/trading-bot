import { ADX } from 'technicalindicators'
import { Kline } from '../types/kline'
import { ADXOutput } from 'technicalindicators/declarations/directionalmovement/ADX'
import { IndicatorADXCreate } from '../models/indicator'

export class AdxIndicator {
  constructor(private readonly period: number) {}
  calculate(symbol: string, klines: Kline[]): IndicatorADXCreate {
    const values: ADXOutput[] = ADX.calculate({
      period: this.period,
      high: klines.map((k: Kline) => k.highPrice),
      low: klines.map((k: Kline) => k.lowPrice),
      close: klines.map((k: Kline) => k.closePrice),
    })

    const value: ADXOutput = values[values.length - 1]

    return {
      period: this.period,
      symbol: symbol,
      price: klines[klines.length - 1].closePrice,
      adx: value.adx,
      pdi: value.pdi,
      mdi: value.mdi,
    }
  }
}
