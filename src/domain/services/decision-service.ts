import { Side } from '../types/side'
import { calculateSL, calculateTP } from '../helpers/stops-helper'
import { StrategyCreate } from '../models/strategy'
import { IndicatorList } from '../models/indicator'
import { StopsService } from './stops-service'
import { IndicatorService } from './indicator-service'
import { median } from '../helpers/math-helper'

export class DecisionService {
  constructor(
    private readonly stopsService: StopsService,
    private readonly indicatorService: IndicatorService,
  ) {}

  async evaluate(symbol: string): Promise<StrategyCreate> {
    const indicators: IndicatorList = await this.indicatorService.getAll(symbol)
    const { bb, sma, rsi, smaCross } = indicators

    if (!bb || !sma || !rsi || !smaCross) {
      throw new Error(
        `There are no indicators for this symbol to evaluate a decision! Symbol: ${symbol}`,
      )
    }

    const price: number = median([
      bb.price,
      sma.price,
      rsi.price,
      smaCross.price,
    ])

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
      tp = calculateTP(side, price, this.stopsService.getTakeProfit())
      sl = calculateSL(side, price, this.stopsService.getStopLoss())
    }

    return {
      symbol,
      price,
      side,
      tp,
      sl,
    }
  }
}
