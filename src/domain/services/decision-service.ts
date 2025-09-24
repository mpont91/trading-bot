import { Side } from '../types/side'
import { calculateSL, calculateTP } from '../helpers/stops-helper'
import { StrategyCreate } from '../models/strategy'
import { IndicatorList } from '../models/indicator'
import { StopsService } from './stops-service'
import { getEmptyStrategy } from '../helpers/strategy-helper'
import { IndicatorService } from './indicator-service'

export class DecisionService {
  constructor(
    private readonly stopsService: StopsService,
    private readonly indicatorService: IndicatorService,
  ) {}

  async evaluate(symbol: string): Promise<StrategyCreate> {
    const indicators: IndicatorList = await this.indicatorService.getAll(symbol)
    const { bb, sma, rsi, smaCross } = indicators

    if (!bb || !sma || !rsi || !smaCross) {
      return getEmptyStrategy(symbol)
    }

    let side: Side = 'hold'
    let tp: number | undefined = undefined
    let sl: number | undefined = undefined

    if (
      bb.price <= bb.lower &&
      sma.price < sma.sma &&
      rsi.rsi < 30 &&
      smaCross.smaShort > smaCross.smaLong
    ) {
      side = 'long'
    } else if (
      bb.price >= bb.upper &&
      sma.price > sma.sma &&
      rsi.rsi > 70 &&
      smaCross.smaShort < smaCross.smaLong
    ) {
      side = 'short'
    }

    if (side !== 'hold') {
      tp = calculateTP(side, bb.price, this.stopsService.getTakeProfit())
      sl = calculateSL(side, bb.price, this.stopsService.getStopLoss())
    }

    return {
      symbol,
      price: bb.price,
      side,
      tp,
      sl,
    }
  }
}
