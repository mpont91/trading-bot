import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { Strategy } from './strategy'
import { StrategyStops } from '../types/strategy-stops'
import {
  StrategyBuyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'
import { calculateSL, calculateTP } from '../helpers/stops-helper'
import { StrategySMACrossSimpleSettings } from '../types/settings'
import { BbDoubleIndicatorCalculator } from '../indicators/bb-double-indicator-calculator'

export class DoubleBollingerBandsStrategy extends Strategy {
  bbDouble: BbDoubleIndicatorCalculator
  constructor(protected readonly settings: StrategySMACrossSimpleSettings) {
    super(settings)
    this.bbDouble = new BbDoubleIndicatorCalculator(20, 1, 20, 2)
  }

  name = 'Double bollinger bands strategy'

  evaluateBuyConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyBuyConditions {
    const { smaCross } = indicators
    return {
      bullMarket: smaCross.smaShort > smaCross.smaLong,
    }
  }

  evaluateSellConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategySellConditions {
    const { smaCross } = indicators
    return {
      bearMarket: smaCross.smaShort < smaCross.smaLong,
    }
  }

  evaluateShouldSell(sellConditions: StrategySellConditions): boolean {
    return !!sellConditions.bearMarket
  }

  evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean {
    return !!buyConditions.bullMarket
  }

  calculateStops(): StrategyStops {
    if (!this.medianPrice) {
      throw new Error(
        'Median price is not calculated. Needed for calculate stops.',
      )
    }
    const tp: number = this.settings.tp
    const sl: number = this.settings.sl
    const ts: number = this.settings.ts

    const tpPrice: number = calculateTP(this.medianPrice, tp)
    const slPrice: number = calculateSL(this.medianPrice, sl)

    return {
      tp,
      sl,
      ts,
      tpPrice,
      slPrice,
    }
  }
}
