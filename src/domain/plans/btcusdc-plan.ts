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
import { BasePlan } from './base-plan'

export class BtcusdcPlan extends BasePlan {
  protected readonly symbol: string = 'BTCUSDC'
  protected readonly timeFrame: TimeFrame = TimeFrame['30m']
  protected readonly candles: number = 500

  constructor(indicatorService: IndicatorService) {
    super(indicatorService)
  }

  protected getStrategyConditions(candles: Candle[]): StrategyConditions {
    const movingAverageCrossoverStrategy = new MovingAverageCrossoverStrategy(
      this.indicatorService,
      this.symbol,
      candles,
    )
    const conditions =
      movingAverageCrossoverStrategy.evaluateStrategyConditions()

    return {
      buy: { ...conditions.buy },
      sell: { ...conditions.sell },
    }
  }

  protected evaluateShouldSell(
    sellConditions: StrategySellConditions,
  ): boolean {
    return !!sellConditions.movingAverageCrossoverDeathCross
  }

  protected evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean {
    return !!buyConditions.movingAverageCrossoverGoldenCross
  }

  protected calculateStops(price: number): StrategyStops {
    const tp: number = 0.095
    const sl: number = 0.11
    const ts: number = 0.001

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
