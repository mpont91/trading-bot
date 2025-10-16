import { IndicatorService } from '../services/indicator-service'
import { Candle } from '../types/candle'
import { StrategyConditions } from '../types/strategy-conditions'
import { BbIndicatorResult } from '../indicators/bb-indicator'
import { Strategy } from './strategy'

export interface BollingerBandStrategySettings {
  period: number
  stdDev: number
  periodInner: number
  stdDevInner: number
  periodOuter: number
  stdDevOuter: number
  squeezeWidthThreshold: number
}

export class BollingerBandStrategy implements Strategy {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly symbol: string,
    private readonly candles: Candle[],
    private readonly settings: BollingerBandStrategySettings = {
      period: 20,
      stdDev: 2,
      periodInner: 20,
      stdDevInner: 1,
      periodOuter: 20,
      stdDevOuter: 1,
      squeezeWidthThreshold: 0.05,
    },
  ) {}

  evaluateStrategyConditions(): StrategyConditions {
    const bb: BbIndicatorResult = this.indicatorService.bb(
      this.symbol,
      this.candles,
      this.settings.period,
      this.settings.stdDev,
    )

    const bbInner: BbIndicatorResult = this.indicatorService.bb(
      this.symbol,
      this.candles,
      this.settings.periodInner,
      this.settings.stdDevInner,
    )
    const bbOuter: BbIndicatorResult = this.indicatorService.bb(
      this.symbol,
      this.candles,
      this.settings.periodOuter,
      this.settings.stdDevOuter,
    )

    const currentCandle: Candle = this.candles[this.candles.length - 1]
    const price: number = currentCandle.closePrice
    const lowPrice: number = currentCandle.lowPrice

    const DoubleBollingerBandBuyZone: boolean =
      price > bbInner.upper && price < bbOuter.upper
    const BollingerBandDoubleBollingerBandBuy: boolean =
      DoubleBollingerBandBuyZone && lowPrice <= bbInner.upper
    const BollingerBandDoubleBollingerBandSell: boolean = price < bbInner.upper

    const BollingerBandMomentumBuy: boolean = price > bb.upper
    const BollingerBandMomentumSell: boolean = price < bb.middle

    const BollingerBandSqueezeWidth: number = (bb.upper - bb.lower) / bb.middle
    const BollingerBandSqueeze: boolean =
      BollingerBandSqueezeWidth < this.settings.squeezeWidthThreshold
    const BollingerBandSqueezeBuy: boolean =
      BollingerBandSqueeze && price > bb.upper
    const BollingerBandSqueezeSell: boolean = price < bb.upper

    return {
      buy: {
        BollingerBandDoubleBollingerBandBuy,
        BollingerBandMomentumBuy,
        BollingerBandSqueezeBuy,
      },
      sell: {
        BollingerBandDoubleBollingerBandSell,
        BollingerBandMomentumSell,
        BollingerBandSqueezeSell,
      },
    }
  }
}
