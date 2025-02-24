import { BollingerBands } from 'technicalindicators'
import { Kline } from '../types/kline'
import { BollingerBandsOutput } from 'technicalindicators/declarations/generated'
import { IndicatorBBCreate } from '../models/indicator'

export class BbIndicator {
  constructor(
    private readonly period: number,
    private readonly multiplier: number,
  ) {}

  calculate(symbol: string, klines: Kline[]): IndicatorBBCreate {
    const values: BollingerBandsOutput[] = BollingerBands.calculate({
      period: this.period,
      stdDev: this.multiplier,
      values: klines.map((k: Kline) => k.closePrice),
    })

    const value: BollingerBandsOutput = values[values.length - 1]

    return {
      period: this.period,
      symbol: symbol,
      price: klines[klines.length - 1].closePrice,
      upper: value.upper,
      middle: value.middle,
      lower: value.lower,
      pb: value.pb,
    }
  }
}
