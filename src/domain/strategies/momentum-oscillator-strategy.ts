import { IndicatorService } from '../services/indicator-service'
import { Candle } from '../types/candle'
import { StrategyConditions } from '../types/strategy-conditions'
import { RsiIndicatorResult } from '../indicators/rsi-indicator'
import { Strategy } from './strategy'

export interface MomentumOscillatorStrategySettings {
  period: number
  oversoldThreshold: number
  stronglyOversoldThreshold: number
  extremelyOversoldThreshold: number
  overboughtThreshold: number
  stronglyOverboughtThreshold: number
  extremelyOverboughtThreshold: number
}

export class MomentumOscillatorStrategy implements Strategy {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly symbol: string,
    private readonly candles: Candle[],
    private readonly settings: MomentumOscillatorStrategySettings = {
      period: 14,
      oversoldThreshold: 30,
      stronglyOversoldThreshold: 20,
      extremelyOversoldThreshold: 10,
      overboughtThreshold: 70,
      stronglyOverboughtThreshold: 80,
      extremelyOverboughtThreshold: 90,
    },
  ) {}

  evaluateStrategyConditions(): StrategyConditions {
    const rsi: RsiIndicatorResult = this.indicatorService.rsi(
      this.symbol,
      this.candles,
      this.settings.period,
    )
    return {
      buy: {
        MomentumOscillatorOversold:
          rsi.rsi <= this.settings.oversoldThreshold &&
          rsi.rsi > this.settings.stronglyOversoldThreshold,
        MomentumOscillatorStronglyOversold:
          rsi.rsi <= this.settings.stronglyOversoldThreshold &&
          rsi.rsi > this.settings.extremelyOversoldThreshold,
        MomentumOscillatorExtremelyOversold:
          rsi.rsi <= this.settings.extremelyOversoldThreshold,
      },
      sell: {
        MomentumOscillatorOverbought:
          rsi.rsi >= this.settings.overboughtThreshold &&
          rsi.rsi < this.settings.stronglyOverboughtThreshold,
        MomentumOscillatorStronglyOverbought:
          rsi.rsi >= this.settings.stronglyOverboughtThreshold &&
          rsi.rsi < this.settings.extremelyOverboughtThreshold,
        MomentumOscillatorExtremelyOverbought:
          rsi.rsi >= this.settings.extremelyOverboughtThreshold,
      },
    }
  }
}
