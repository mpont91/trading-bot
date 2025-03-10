import { IndicatorBB } from '../models/indicator'
import { StrategyCreate } from '../models/strategy'
import { Side } from '../types/side'
import { calculateSL, calculateTP } from '../helpers/stops-helper'
import { LeverageService } from '../services/leverage-service'
import { StopsService } from '../services/stops-service'
import { IndicatorService } from '../services/indicator-service'
import { getEmptyStrategy } from '../helpers/strategy-helper'

export class BbStrategy {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly leverageService: LeverageService,
    private readonly stopsService: StopsService,
  ) {}

  public async createStrategy(symbol: string): Promise<StrategyCreate> {
    const bb: IndicatorBB | null = await this.indicatorService.getBB(symbol)

    if (!bb) {
      return getEmptyStrategy(symbol)
    }

    let side: Side = 'hold'
    let leverage: number | undefined = undefined
    let tp: number | undefined = undefined
    let sl: number | undefined = undefined

    if (bb.price <= bb.lower) {
      side = 'long'
    } else if (bb.price >= bb.upper) {
      side = 'short'
    }

    if (side !== 'hold') {
      leverage = this.leverageService.getLeverage()
      tp = calculateTP(side, bb.price, this.stopsService.getTakeProfit())
      sl = calculateSL(side, bb.price, this.stopsService.getStopLoss())
    }

    return {
      symbol: bb.symbol,
      price: bb.price,
      side: side,
      leverage: leverage,
      tp: tp,
      sl: sl,
    }
  }
}
