import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { IndicatorSettings, StrategySlowSwingSettings } from '../types/settings'
import { Strategy } from './strategy'
import { TimeFrame } from '../types/candle'
import {
  StrategyBuyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'
import { StrategyStops } from '../types/strategy-stops'

export class SlowSwingStrategy extends Strategy {
  constructor(private readonly settings: StrategySlowSwingSettings) {
    super()
  }

  name = 'Slow swing strategy'

  getIndicatorSettings(): IndicatorSettings {
    return {
      sma: 20,
      rsi: 14,
      adx: 14,
      atr: 14,
      bb: {
        period: 20,
        multiplier: 2.5,
      },
      smaCross: {
        periodLong: 50,
        periodShort: 20,
      },
    }
  }

  getTimeFrame(): TimeFrame {
    return TimeFrame['1d']
  }

  getCandles(): number {
    return 250
  }

  evaluateBuyConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyBuyConditions {
    const { bb, sma, rsi, adx, smaCross } = indicators

    const bullishMomentumMin: boolean =
      rsi.rsi > this.settings.bullishMomentumMinRSI
    const bullishMomentumMax: boolean =
      rsi.rsi < this.settings.bullishMomentumMaxRSI

    return {
      trendUp: sma.price > sma.sma,
      goldenCross: smaCross.smaShort > smaCross.smaLong,
      strongTrend: adx.adx > this.settings.strongTrendMinADX,
      bullishDirection: adx.pdi > adx.mdi,
      bullishMomentum: bullishMomentumMin && bullishMomentumMax,
      notOverextended: bb.price < bb.upper,
      favorableEntryPrice: bb.pb <= this.settings.favorableEntryPriceMaxBB,
    }
  }

  evaluateSellConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategySellConditions {
    const { smaCross, rsi, bb, adx } = indicators
    return {
      deathCross: smaCross.smaShort < smaCross.smaLong,
      bearishMomentum: rsi.rsi < this.settings.bearishMomentumMaxRSI,
      trendWeakening: bb.price < bb.middle,
      bearishConviction: adx.adx > this.settings.bearishConvictionMinADX,
    }
  }

  evaluateShouldSell(sellConditions: StrategySellConditions): boolean {
    return (
      !!sellConditions.deathCross &&
      !!sellConditions.bearishMomentum &&
      !!sellConditions.trendWeakening &&
      !!sellConditions.bearishConviction
    )
  }

  evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean {
    return this.calculateBuyScore(buyConditions) >= this.settings.buyScoreMin
  }

  private calculateBuyScore(buyConditions: StrategyBuyConditions): number {
    if (!buyConditions.goldenCross || !buyConditions.favorableEntryPrice) {
      return 0
    }

    let score: number = 0

    if (buyConditions.favorableEntryPrice) score += 3
    if (buyConditions.goldenCross) score += 2
    if (buyConditions.bullishDirection) score += 1
    if (buyConditions.bullishMomentum) score += 1
    if (buyConditions.strongTrend) score += 1

    return score
  }

  calculateStops(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyStops {
    const { bb, atr } = indicators

    const price: number = bb.price

    const slPrice: number = bb.lower
    const tpPrice: number = bb.upper

    const sl: number = price - slPrice
    const tp: number = tpPrice - price

    const slPercent: number = (sl / price) * 100
    const tpPercent: number = (tp / price) * 100

    const trailingStopMultiplier: number = this.settings.trailingStopMultiplier
    const tsPercent: number = ((atr.atr * trailingStopMultiplier) / price) * 100

    return {
      sl: slPercent,
      tp: tpPercent,
      ts: tsPercent,
      tpPrice,
      slPrice,
    }
  }
}
