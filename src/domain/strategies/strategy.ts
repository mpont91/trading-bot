import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'
import { Candle, TimeFrame } from '../types/candle'
import { StrategyStops } from '../types/strategy-stops'
import {
  StrategyBuyConditions,
  StrategyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'
import { IndicatorService } from '../services/indicator-service'
import { MovingAverageCrossoverStrategy } from './moving-average-crossover-strategy'
import { calculateSL, calculateTP } from '../helpers/stops-helper'
import { MomentumOscillatorStrategy } from './momentum-oscillator-strategy'

export class Strategy {
  constructor(private readonly indicatorService: IndicatorService) {}

  getTimeFrame(): TimeFrame {
    return TimeFrame['4h']
  }

  getCandles(): number {
    return 500
  }

  calculate(
    symbol: string,
    candles: Candle[],
  ): StrategyReport | StrategyReportCreate {
    const price: number = candles[candles.length - 1].closePrice

    const movingAverageCrossoverStrategy: MovingAverageCrossoverStrategy =
      new MovingAverageCrossoverStrategy(this.indicatorService, symbol, candles)

    const momentumOscillatorStrategy: MomentumOscillatorStrategy =
      new MomentumOscillatorStrategy(this.indicatorService, symbol, candles)

    const movingAverageCrossoverStrategyConditions: StrategyConditions =
      movingAverageCrossoverStrategy.evaluateStrategyConditions()
    const momentumOscillatorStrategyConditions: StrategyConditions =
      momentumOscillatorStrategy.evaluateStrategyConditions()

    const strategyConditions: StrategyConditions = {
      buy: {
        ...movingAverageCrossoverStrategyConditions.buy,
        ...momentumOscillatorStrategyConditions.buy,
      },
      sell: {
        ...movingAverageCrossoverStrategyConditions.sell,
        ...momentumOscillatorStrategyConditions.sell,
      },
    }

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
      symbol,
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

  evaluateShouldSell(sellConditions: StrategySellConditions): boolean {
    return !!sellConditions.deathCross && !!sellConditions.overbought
  }

  evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean {
    return !!buyConditions.goldenCross && !!buyConditions.oversold
  }

  calculateStops(price: number): StrategyStops {
    const tp: number = 0.05
    const sl: number = 0.03
    const ts: number = 0.02

    const tpPrice: number = calculateTP(price, tp)
    const slPrice: number = calculateSL(price, sl)

    return {
      tp,
      sl,
      ts,
      tpPrice,
      slPrice,
    }
  }
}
