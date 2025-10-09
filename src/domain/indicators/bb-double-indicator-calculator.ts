import { BollingerBands } from 'technicalindicators'
import { Candle } from '../types/candle'
import { BollingerBandsOutput } from 'technicalindicators/declarations/generated'
import { IndicatorBBDoubleCreate } from '../models/indicator'
import {
  validateIndicatorCandles,
  validateIndicatorValues,
} from '../helpers/indicator-helper'

export class BbDoubleIndicatorCalculator {
  constructor(
    private readonly periodInner: number,
    private readonly stdDevInner: number,
    private readonly periodOuter: number,
    private readonly stdDevOuter: number,
  ) {}

  calculate(symbol: string, candles: Candle[]): IndicatorBBDoubleCreate {
    validateIndicatorCandles(this.periodInner, candles.length)
    const valuesInner: BollingerBandsOutput[] = BollingerBands.calculate({
      period: this.periodInner,
      stdDev: this.stdDevInner,
      values: candles.map((k: Candle) => k.closePrice),
    })

    const valueInner: BollingerBandsOutput = valuesInner[valuesInner.length - 1]

    validateIndicatorValues(valuesInner.length)

    validateIndicatorCandles(this.periodOuter, candles.length)
    const valuesOuter: BollingerBandsOutput[] = BollingerBands.calculate({
      period: this.periodOuter,
      stdDev: this.stdDevOuter,
      values: candles.map((k: Candle) => k.closePrice),
    })

    const valueOuter: BollingerBandsOutput = valuesOuter[valuesOuter.length - 1]

    validateIndicatorValues(valuesOuter.length)

    return {
      periodInner: this.periodInner,
      periodOuter: this.periodOuter,
      stdDevInner: this.stdDevInner,
      stdDevOuter: this.stdDevOuter,
      symbol: symbol,
      price: candles[candles.length - 1].closePrice,
      upperInner: valueInner.upper,
      middleInner: valueInner.middle,
      lowerInner: valueInner.lower,
      pbInner: valueInner.pb,
      upperOuter: valueOuter.upper,
      middleOuter: valueOuter.middle,
      lowerOuter: valueOuter.lower,
      pbOuter: valueOuter.pb,
    }
  }
}
