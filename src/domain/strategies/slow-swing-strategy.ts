import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { StrategySlowSwingSettings } from '../types/settings'
import { Strategy } from './strategy'
import {
  StrategyBuyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'
import { StrategyStops } from '../types/strategy-stops'

export class SlowSwingStrategy extends Strategy {
  protected constructor(
    protected readonly settings: StrategySlowSwingSettings,
  ) {
    super(settings)
  }

  name = 'Slow swing strategy'

  evaluateBuyConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyBuyConditions {
    const { smaCross, rsi, adx } = indicators

    const bullMarket: boolean = smaCross.smaShort > smaCross.smaLong
    const healthyDip: boolean =
      rsi.rsi > this.settings.healthyDipMinRSI &&
      rsi.rsi < this.settings.healthyDipMaxRSI
    const trendStrength: boolean = adx.adx > this.settings.trendStrengthMinADX

    return { bullMarket, healthyDip, trendStrength }
  }

  evaluateSellConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategySellConditions {
    const { smaCross } = indicators

    const supportBroken = smaCross.price < smaCross.smaShort

    return { supportBroken }
  }

  evaluateShouldSell(sellConditions: StrategySellConditions): boolean {
    return !!sellConditions.supportBroken
  }

  evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean {
    return (
      !!buyConditions.bullMarket &&
      !!buyConditions.healthyDip &&
      !!buyConditions.trendStrength
    )
  }

  calculateStops(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyStops {
    const { atr } = indicators
    const stopsMultiplier = this.settings.stopsMultiplier

    const distance = atr.atr * stopsMultiplier
    const slPrice = atr.price - distance
    const tpPrice = atr.price + distance

    const ts = atr.atr * this.settings.trailingStopMultiplier

    return {
      slPrice,
      tpPrice,
      sl: (distance / atr.price) * 100,
      tp: (distance / atr.price) * 100,
      ts: (ts / atr.price) * 100,
    }
  }
}
