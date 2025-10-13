import { IndicatorService } from '../services/indicator-service'
import { Candle } from '../types/candle'
import { StrategyConditions } from '../types/strategy-conditions'
import { RsiIndicatorResult } from '../indicators/rsi-indicator'

export class MomentumOscillatorStrategy {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly symbol: string,
    private readonly candles: Candle[],
  ) {}

  evaluateStrategyConditions(): StrategyConditions {
    const rsi: RsiIndicatorResult = this.indicatorService.rsi(
      this.symbol,
      this.candles,
      14,
    )
    return {
      buy: {
        oversold: rsi.rsi <= 30 && rsi.rsi > 20,
        stronglyOversold: rsi.rsi <= 20 && rsi.rsi > 10,
        extremelyOversold: rsi.rsi <= 10,
      },
      sell: {
        overbought: rsi.rsi >= 70 && rsi.rsi < 80,
        stronglyOverbought: rsi.rsi >= 80 && rsi.rsi < 90,
        extremelyOverbought: rsi.rsi >= 90,
      },
    }
  }
}
