import { Signal } from '../types/signal'
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

    let signal: Signal = Signal.HOLD
    let tp: number | undefined = undefined
    let sl: number | undefined = undefined
    let ts: number | undefined = undefined
    let tpPrice: number | undefined = undefined
    let slPrice: number | undefined = undefined

    if (
      bb.price <= bb.lower &&
      sma.price < sma.sma &&
      rsi.rsi < 30 &&
      smaCross.smaShort > smaCross.smaLong
    ) {
      signal = Signal.BUY
      tp = this.stopsService.getTakeProfit()
      sl = this.stopsService.getStopLoss()
      ts = this.stopsService.getTrailingStop()
      tpPrice = calculateTP(price, tp)
      slPrice = calculateSL(price, tp)
    } else if (
      bb.price >= bb.upper &&
      sma.price > sma.sma &&
      rsi.rsi > 70 &&
      smaCross.smaShort < smaCross.smaLong
    ) {
      signal = Signal.SELL
    }

    return {
      symbol,
      price,
      signal,
      tp,
      sl,
      ts,
      tpPrice,
      slPrice,
    }
  }
}
