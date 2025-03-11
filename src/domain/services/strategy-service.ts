import { StrategyRepository } from '../repositories/strategy-repository'
import { Strategy, StrategyCreate } from '../models/strategy'
import {
  convertSymbolToFuturesBaseCurrency,
  convertSymbolToSpotBaseCurrency,
  isSymbolForSpotBaseCurrency,
} from '../helpers/symbol-helper'
import { Signals } from '../types/signals'
import { TimeInterval } from '../types/time-interval'
import { reduceRecordsData } from '../helpers/graph-helper'

export class StrategyService {
  constructor(private readonly strategyRepository: StrategyRepository) {}

  async create(strategy: StrategyCreate): Promise<void> {
    await this.strategyRepository.create(strategy)
  }

  async getLastForSymbol(symbol: string): Promise<Strategy> {
    const needConversion: boolean = isSymbolForSpotBaseCurrency(symbol)

    if (needConversion) {
      symbol = convertSymbolToFuturesBaseCurrency(symbol)
    }

    const strategy: Strategy =
      await this.strategyRepository.getLastForSymbol(symbol)

    if (needConversion) {
      strategy.symbol = convertSymbolToSpotBaseCurrency(strategy.symbol)
    }

    return strategy
  }

  async getLastManyForSymbol(symbol: string): Promise<Strategy[]> {
    return this.strategyRepository.getLastManyForSymbol(symbol)
  }

  async getLastManyOpportunitiesForSymbol(symbol: string): Promise<Strategy[]> {
    return this.strategyRepository.getLastManyOpportunitiesForSymbol(symbol)
  }

  async getLastManyForEachSymbol(): Promise<Strategy[]> {
    return this.strategyRepository.getLastManyForEachSymbol()
  }

  async getLastManyOpportunitiesForEachSymbol(): Promise<Strategy[]> {
    return this.strategyRepository.getLastManyOpportunitiesForEachSymbol()
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
