import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'
import { Candle, TimeFrame } from '../types/candle'
import { StrategyStops } from '../types/strategy-stops'
import {
  StrategyBuyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'
import { IndicatorService } from '../services/indicator-service'
import { calculateSL, calculateTP } from '../helpers/stops-helper'
import { SmaIndicatorResult } from '../indicators/sma-indicator'

export class Strategy {
  price: number | null = null
  constructor(private readonly indicatorService: IndicatorService) {}

  evaluateBuyConditions(
    symbol: string,
    candles: Candle[],
  ): StrategyBuyConditions {
    const smaShort: SmaIndicatorResult = this.indicatorService.sma(
      symbol,
      candles,
      20,
    )
    const smaLong: SmaIndicatorResult = this.indicatorService.sma(
      symbol,
      candles,
      50,
    )
    return {
      bullMarket: smaShort.sma > smaLong.sma,
    }
  }

  evaluateSellConditions(
    symbol: string,
    candles: Candle[],
  ): StrategySellConditions {
    const smaShort: SmaIndicatorResult = this.indicatorService.sma(
      symbol,
      candles,
      20,
    )
    const smaLong: SmaIndicatorResult = this.indicatorService.sma(
      symbol,
      candles,
      50,
    )
    return {
      bearMarket: smaShort.sma < smaLong.sma,
    }
  }

  evaluateShouldSell(sellConditions: StrategySellConditions): boolean {
    return !!sellConditions.bearMarket
  }

  evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean {
    return !!buyConditions.bullMarket
  }

  calculateStops(): StrategyStops {
    if (!this.price) {
      throw new Error('Price is not calculated. Needed for calculate stops.')
    }
    const tp: number = 0.05
    const sl: number = 0.02
    const ts: number = 0.01

    const tpPrice: number = calculateTP(this.price, tp)
    const slPrice: number = calculateSL(this.price, sl)

    return {
      tp,
      sl,
      ts,
      tpPrice,
      slPrice,
    }
  }

  getTimeFrame(): TimeFrame {
    return TimeFrame['1h']
  }

  getCandles(): number {
    return 240
  }

  calculate(
    symbol: string,
    candles: Candle[],
  ): StrategyReport | StrategyReportCreate {
    this.price = candles[candles.length - 1].closePrice
    const buyConditions: StrategyBuyConditions = this.evaluateBuyConditions(
      symbol,
      candles,
    )
    const sellConditions: StrategySellConditions = this.evaluateSellConditions(
      symbol,
      candles,
    )
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
      stops = this.calculateStops()
    }

    return {
      symbol,
      price: this.price,
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
