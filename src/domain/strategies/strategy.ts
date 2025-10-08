import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'
import { TimeFrame } from '../types/candle'
import { IndicatorSettings } from '../types/settings'
import { StrategyStops } from '../types/strategy-stops'
import { median } from '../helpers/math-helper'
import {
  StrategyBuyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'

export abstract class Strategy {
  protected abstract name: string
  abstract getIndicatorSettings(): IndicatorSettings
  abstract getTimeFrame(): TimeFrame
  abstract getCandles(): number
  abstract calculateStops(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyStops
  abstract evaluateBuyConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyBuyConditions
  abstract evaluateSellConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategySellConditions
  abstract evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean
  abstract evaluateShouldSell(sellConditions: StrategySellConditions): boolean

  calculate(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyReport | StrategyReportCreate {
    const { bb, sma, rsi, adx, atr, smaCross } = indicators

    const symbol: string = bb.symbol

    const price: number = median([
      bb.price,
      sma.price,
      rsi.price,
      atr.price,
      adx.price,
      smaCross.price,
    ])

    const buyConditions: StrategyBuyConditions =
      this.evaluateBuyConditions(indicators)
    const sellConditions: StrategySellConditions =
      this.evaluateSellConditions(indicators)
    const shouldBuy: boolean = this.evaluateShouldBuy(buyConditions)
    const shouldSell: boolean = this.evaluateShouldSell(sellConditions)

    let stops: StrategyStops = {
      sl: null,
      tp: null,
      ts: null,
      tpPrice: null,
      slPrice: null,
    }

    if (shouldBuy) {
      stops = this.calculateStops(indicators)
    }

    return {
      name: this.name,
      symbol,
      price,
      conditions: {
        buy: buyConditions,
        sell: sellConditions,
      },
      ...stops,
      shouldBuy,
      shouldSell,
    }
  }
}
