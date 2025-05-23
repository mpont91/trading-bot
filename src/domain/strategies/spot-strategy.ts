import {
  IndicatorBB,
  IndicatorRSI,
  IndicatorSMA,
  IndicatorSMACross,
} from '../models/indicator'
import { StrategySpotCreate } from '../models/strategy'
import { Side } from '../types/side'
import { calculateSL, calculateTP } from '../helpers/stops-helper'
import { StopsService } from '../services/stops-service'
import { IndicatorService } from '../services/indicator-service'
import { getEmptyStrategy } from '../helpers/strategy-helper'
import { StrategyInterface } from './strategy-interface'

export class SpotStrategy implements StrategyInterface {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly stopsService: StopsService,
  ) {}

  public async createStrategy(symbol: string): Promise<StrategySpotCreate> {
    const sma: IndicatorSMA | null = await this.indicatorService.getSMA(symbol)
    const rsi: IndicatorRSI | null = await this.indicatorService.getRSI(symbol)
    const bb: IndicatorBB | null = await this.indicatorService.getBB(symbol)
    const smaCross: IndicatorSMACross | null =
      await this.indicatorService.getSMACross(symbol)

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
      symbol: bb.symbol,
      price: bb.price,
      side: side,
      tp: tp,
      sl: sl,
    }
  }
}
