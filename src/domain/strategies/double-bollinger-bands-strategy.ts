import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { Strategy } from './strategy'
import { StrategyStops } from '../types/strategy-stops'
import {
  StrategyBuyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'
import { StrategySettings } from '../types/settings'

export class DoubleBollingerBandsStrategy extends Strategy {
  constructor(protected readonly settings: StrategySettings) {
    super(settings)
  }

  name = 'Double bollinger bands strategy'

  evaluateBuyConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyBuyConditions {
    const { bbDouble, adx } = indicators

    return {
      buyZone:
        bbDouble.price < bbDouble.upperOuter &&
        bbDouble.price > bbDouble.upperInner,
      trendStrength: adx.adx > 25,
    }
  }

  evaluateSellConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategySellConditions {
    const { bbDouble } = indicators
    return {
      momentumLost: bbDouble.price < bbDouble.lowerOuter,
    }
  }

  evaluateShouldSell(sellConditions: StrategySellConditions): boolean {
    return !!sellConditions.momentumLost
  }

  evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean {
    return !!buyConditions.buyZone && !!buyConditions.trendStrength
  }

  calculateStops(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyStops {
    const { bbDouble, atr } = indicators

    const slPrice: number = bbDouble.middleInner - atr.atr * 0.5
    const risk: number = bbDouble.price - slPrice
    const tpPrice: number = bbDouble.price + risk * 2

    const ts: number = 0.02
    const sl: number = (bbDouble.price - slPrice) / bbDouble.price
    const tp: number = (tpPrice - bbDouble.price) / bbDouble.price

    return {
      tp,
      sl,
      ts,
      tpPrice,
      slPrice,
    }
  }
}
