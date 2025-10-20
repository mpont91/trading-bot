import { Candle, TimeFrame } from '../types/candle'
import { StrategyStops } from '../types/strategy-stops'
import {
  StrategyBuyConditions,
  StrategyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'
import { IndicatorService } from '../services/indicator-service'
import { calculateSL, calculateTP } from '../helpers/stops-helper'
import { BollingerBandStrategy } from '../strategies/bollinger-band-strategy'
import { MovingAverageCrossoverStrategy } from '../strategies/moving-average-crossover-strategy'
import { BasePlan } from './base-plan'

export class EthusdcPlan extends BasePlan {
  protected readonly symbol: string = 'ETHUSDC'
  protected readonly timeFrame: TimeFrame = TimeFrame['30m']
  protected readonly candles: number = 500

  constructor(indicatorService: IndicatorService) {
    super(indicatorService)
  }

  protected getStrategyConditions(candles: Candle[]): StrategyConditions {
    const bollingerBandStrategy = new BollingerBandStrategy(
      this.indicatorService,
      this.symbol,
      candles,
    )
    const bollingerConditions =
      bollingerBandStrategy.evaluateStrategyConditions()

    const movingAverageCrossoverStrategy = new MovingAverageCrossoverStrategy(
      this.indicatorService,
      this.symbol,
      candles,
    )
    const movingAverageConditions =
      movingAverageCrossoverStrategy.evaluateStrategyConditions()

    return {
      buy: {
        ...bollingerConditions.buy,
        ...movingAverageConditions.buy,
      },
      sell: {
        ...bollingerConditions.sell,
        ...movingAverageConditions.sell,
      },
    }
  }

  protected evaluateShouldSell(
    sellConditions: StrategySellConditions,
  ): boolean {
    return (
      !!sellConditions.bollingerBandLowerSell &&
      !!sellConditions.movingAverageCrossoverDeathCross
    )
  }

  protected evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean {
    return !!buyConditions.bollingerBandMomentumBuy
  }

  protected calculateStops(price: number): StrategyStops {
    const tp: number = 0.09
    const sl: number = 0.09
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
