import { StrategyRepository } from '../repositories/strategy-repository'
import { Strategy, StrategyCreate } from '../models/strategy'
import { Signals } from '../types/signals'
import { TimeInterval } from '../types/time-interval'
import { reduceRecordsData } from '../helpers/graph-helper'
import { IndicatorService } from './indicator-service'
import { StopsService } from './stops-service'
import {
  IndicatorBB,
  IndicatorRSI,
  IndicatorSMA,
  IndicatorSMACross,
} from '../models/indicator'
import { getEmptyStrategy } from '../helpers/strategy-helper'
import { Side } from '../types/side'
import { calculateSL, calculateTP } from '../helpers/stops-helper'

export class StrategyService {
  constructor(
    private readonly strategyRepository: StrategyRepository,
    private readonly indicatorService: IndicatorService,
    private readonly stopsService: StopsService,
  ) {}

  public async create(symbol: string): Promise<StrategyCreate> {
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

  async store(strategy: StrategyCreate): Promise<Strategy> {
    return this.strategyRepository.create(strategy)
  }

  async last(symbol: string): Promise<Strategy> {
    return await this.strategyRepository.last(symbol)
  }

  async list(symbol?: string): Promise<Strategy[]> {
    return this.strategyRepository.list(symbol)
  }

  async listOpportunities(symbol?: string): Promise<Strategy[]> {
    return this.strategyRepository.listOpportunities(symbol)
  }

  async signalsGraph(symbol: string, interval: TimeInterval): Promise<Signals> {
    const prices: Strategy[] = await this.strategyRepository.getPriceGraph(
      symbol,
      interval,
    )
    const pricesReducedData: Strategy[] = reduceRecordsData(prices)

    const opportunities: Strategy[] =
      await this.strategyRepository.getOpportunitiesGraph(symbol, interval)
    const opportunitiesReducedData: Strategy[] =
      reduceRecordsData(opportunities)

    return {
      symbol: symbol,
      prices: pricesReducedData.map((p: Strategy) => ({
        amount: p.price,
        date: p.createdAt,
      })),
      opportunities: opportunitiesReducedData.map((o: Strategy) => ({
        side: o.side,
        date: o.createdAt,
      })),
    }
  }
}
