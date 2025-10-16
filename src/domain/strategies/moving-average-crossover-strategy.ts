import { IndicatorService } from '../services/indicator-service'
import { Candle } from '../types/candle'
import { StrategyConditions } from '../types/strategy-conditions'
import { SmaIndicatorResult } from '../indicators/sma-indicator'
import { Strategy } from './strategy'

export interface MovingAverageCrossoverStrategySettings {
  periodShort: number
  periodLong: number
}

export class MovingAverageCrossoverStrategy implements Strategy {
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
        MovingAverageCrossoverGoldenCross: smaShort.sma > smaLong.sma,
        MovingAverageCrossoverBullishTrend: smaShort.price > smaShort.sma,
      },
      sell: {
        MovingAverageCrossoverDeathCross: smaShort.sma < smaLong.sma,
        MovingAverageCrossoverBearishTrend: smaShort.price < smaShort.sma,
      },
    }
  }
}
