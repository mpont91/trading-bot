import { StrategyCreate } from '../models/strategy'
import { Kline } from '../types/kline'
import { IndicatorService } from './indicator-service'
import { BbIndicatorType } from '../models/indicator'
import { Side } from '../types/side'

export class PredictionService {
  constructor(private readonly indicatorService: IndicatorService) {}
  async predict(symbol: string, klines: Kline[]): Promise<StrategyCreate> {
    return this.bbPrediction(symbol, klines)
  }

  private async bbPrediction(
    symbol: string,
    klines: Kline[],
  ): Promise<StrategyCreate> {
    const bb: BbIndicatorType = await this.indicatorService.bb(klines)
    const price: number = klines[klines.length - 1].closePrice
    let side: Side = 'hold'
    if (price <= bb.lower) {
      side = 'long'
    } else if (price >= bb.upper) {
      side = 'short'
    }

    return {
      symbol: symbol,
      price: price,
      side: side,
    }
  }
}
