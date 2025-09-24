import { Side } from '../types/side'
import { calculateSL, calculateTP } from '../helpers/stops-helper'
import { StrategyCreate } from '../models/strategy'
import { IndicatorList } from '../models/indicator'
import { StopsService } from './stops-service'
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
      throw new Error(
        `There are no indicators for this symbol to evaluate a decision! Symbol: ${symbol}`,
      )
    }

    const price: number = this.median([
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

  private median(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b)

    const mid = Math.floor(sorted.length / 2)

    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2
  }
}
