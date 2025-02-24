import { BollingerBands } from 'technicalindicators'
import { Kline } from '../types/kline'
import { BollingerBandsOutput } from 'technicalindicators/declarations/generated'
import { BbIndicatorType } from '../models/indicator'

export class BbIndicator {
  constructor(
    private readonly period: number,
    private readonly multiplier: number,
  ) {}

  calculate(klines: Kline[]): BbIndicatorType {
    const values: BollingerBandsOutput[] = BollingerBands.calculate({
      period: this.period,
      stdDev: this.multiplier,
      values: klines.map((k: Kline) => k.closePrice),
    })

    return this.toDomain(values[values.length - 1])
  }

  private toDomain(value: BollingerBandsOutput): BbIndicatorType {
    return {
      upper: value.upper,
      middle: value.middle,
      lower: value.lower,
      pb: value.pb,
    }
  }
}
