import { IndicatorService } from '../services/indicator-service'
import { Candle } from '../types/candle'
import { StrategyConditions } from '../types/strategy-conditions'
import { SmaIndicatorResult } from '../indicators/sma-indicator'

export interface MovingAverageCrossoverStrategySettings {
  periodShort: number
  periodLong: number
}

export class MovingAverageCrossoverStrategy {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly symbol: string,
    private readonly candles: Candle[],
    private readonly settings: MovingAverageCrossoverStrategySettings = {
      periodShort: 50,
      periodLong: 200,
    },
  ) {}

  evaluateStrategyConditions(): StrategyConditions {
    const smaShort: SmaIndicatorResult = this.indicatorService.sma(
      this.symbol,
      this.candles,
      this.settings.periodShort,
    )
    const smaLong: SmaIndicatorResult = this.indicatorService.sma(
      this.symbol,
      this.candles,
      this.settings.periodLong,
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
