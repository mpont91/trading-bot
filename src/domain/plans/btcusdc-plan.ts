import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'
import { Candle, TimeFrame } from '../types/candle'
import { StrategyStops } from '../types/strategy-stops'
import {
  StrategyBuyConditions,
  StrategyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'
import { IndicatorService } from '../services/indicator-service'
import { MovingAverageCrossoverStrategy } from '../strategies/moving-average-crossover-strategy'
import { calculateSL, calculateTP } from '../helpers/stops-helper'
import { Plan } from './plan'

export class BtcusdcPlan implements Plan {
  private readonly symbol: string = 'BTCUSDC'

  constructor(private readonly indicatorService: IndicatorService) {}

  getSymbol(): string {
    return this.symbol
  }

  getTimeFrame(): TimeFrame {
    return TimeFrame['30m']
  }

  getCandles(): number {
    return 500
  }

  calculate(candles: Candle[]): StrategyReport | StrategyReportCreate {
    const price: number = candles[candles.length - 1].closePrice

    const movingAverageCrossoverStrategy: MovingAverageCrossoverStrategy =
      new MovingAverageCrossoverStrategy(
        this.indicatorService,
        this.symbol,
        candles,
      )

    const movingAverageCrossoverStrategyConditions: StrategyConditions =
      movingAverageCrossoverStrategy.evaluateStrategyConditions()

    const strategyConditions: StrategyConditions = {
      buy: {
        ...movingAverageCrossoverStrategyConditions.buy,
      },
      sell: {
        ...movingAverageCrossoverStrategyConditions.sell,
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

  evaluateShouldSell(sellConditions: StrategySellConditions): boolean {
    return !!sellConditions.MovingAverageCrossoverDeathCross
  }

  evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean {
    return !!buyConditions.MovingAverageCrossoverGoldenCross
  }

  calculateStops(price: number): StrategyStops {
    const tp: number = 0.095
    const sl: number = 0.11
    const ts: number = 0

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
