import { Candle, TimeFrame } from '../types/candle'
import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'
import { StrategyStops } from '../types/strategy-stops'
import {
  StrategyBuyConditions,
  StrategyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'
import { IndicatorService } from '../services/indicator-service'
import { Plan } from './plan'

export abstract class BasePlan implements Plan {
  protected abstract readonly symbol: string
  protected abstract readonly timeFrame: TimeFrame
  protected abstract readonly candles: number

  constructor(protected readonly indicatorService: IndicatorService) {}

  getSymbol(): string {
    return this.symbol
  }

  getTimeFrame(): TimeFrame {
    return this.timeFrame
  }

  getCandles(): number {
    return this.candles
  }

  calculate(candles: Candle[]): StrategyReport | StrategyReportCreate {
    const price: number = candles[candles.length - 1].closePrice

    const strategyConditions: StrategyConditions =
      this.getStrategyConditions(candles)

    const shouldBuy: boolean = this.evaluateShouldBuy(strategyConditions.buy)
    const shouldSell: boolean = this.evaluateShouldSell(strategyConditions.sell)

    let stops: StrategyStops = {
      sl: null,
      tp: null,
      ts: null,
      tpPrice: null,
      slPrice: null,
    }

    if (shouldBuy) {
      stops = this.calculateStops(price)
    }

    return {
      symbol: this.symbol,
      price,
      conditions: {
        buy: strategyConditions.buy,
        sell: strategyConditions.sell,
      },
      ...stops,
      shouldBuy,
      shouldSell,
    }
  }

  protected abstract calculateStops(price: number): StrategyStops

  protected abstract getStrategyConditions(
    candles: Candle[],
  ): StrategyConditions

  protected abstract evaluateShouldBuy(
    buyConditions: StrategyBuyConditions,
  ): boolean

  protected abstract evaluateShouldSell(
    sellConditions: StrategySellConditions,
  ): boolean
}
