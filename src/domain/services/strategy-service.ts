import { StrategyRepository } from '../repositories/strategy-repository'
import { Strategy, StrategyCreate } from '../models/strategy'
import { StrategyAnalysis } from '../types/strategy-analysis'
import { TimeInterval } from '../types/time-interval'
import { reduceRecordsData } from '../helpers/graph-helper'
import { DecisionService } from './decision-service'

export class StrategyService {
  constructor(
    private readonly strategyRepository: StrategyRepository,
    private readonly decisionService: DecisionService,
  ) {}

  async store(symbol: string): Promise<Strategy> {
    const strategy: StrategyCreate = await this.decisionService.evaluate(symbol)
    return this.strategyRepository.create(strategy)
  }

  async last(symbol: string): Promise<Strategy | null> {
    return await this.strategyRepository.last(symbol)
  }

  async list(symbol?: string): Promise<Strategy[]> {
    return this.strategyRepository.list(symbol)
  }

  async listOpportunities(symbol?: string): Promise<Strategy[]> {
    return this.strategyRepository.listOpportunities(symbol)
  }

  async getStrategyAnalysis(
    symbol: string,
    interval: TimeInterval,
  ): Promise<StrategyAnalysis> {
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
        signal: o.signal,
        date: o.createdAt,
      })),
    }
  }
}
