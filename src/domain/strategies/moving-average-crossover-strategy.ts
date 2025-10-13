import { IndicatorService } from '../services/indicator-service'
import { Candle } from '../types/candle'
import { StrategyConditions } from '../types/strategy-conditions'
import { SmaIndicatorResult } from '../indicators/sma-indicator'

export class MovingAverageCrossoverStrategy {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly symbol: string,
    private readonly candles: Candle[],
  ) {}

  evaluateStrategyConditions(): StrategyConditions {
    const smaShort: SmaIndicatorResult = this.indicatorService.sma(
      this.symbol,
      this.candles,
      50,
    )
    const smaLong: SmaIndicatorResult = this.indicatorService.sma(
      this.symbol,
      this.candles,
      200,
    )
    return {
      buy: {
        goldenCross: smaShort.sma > smaLong.sma,
        bullishTrend: smaShort.price > smaShort.sma,
      },
      sell: {
        deathCross: smaShort.sma < smaLong.sma,
        bearishTrend: smaShort.price < smaShort.sma,
      },
    }
  }
}
