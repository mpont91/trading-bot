import { StrategyActionRepository } from '../repositories/strategy-action-repository'
import { StrategyAction, StrategyActionCreate } from '../models/strategy-action'
import { StrategyAnalysis } from '../types/strategy-analysis'
import { TimeInterval } from '../types/time-interval'
import { reduceRecordsData } from '../helpers/graph-helper'
import { DecisionService } from './decision-service'

export class StrategyService {
  constructor(
    private readonly strategyRepository: StrategyActionRepository,
    private readonly decisionService: DecisionService,
  ) {}

  async calculateAndCreate(symbol: string): Promise<StrategyAction> {
    return this.create(await this.decisionService.fetchAndCalculate(symbol))
  }

  async create(strategy: StrategyActionCreate): Promise<StrategyAction> {
    return this.strategyRepository.create(strategy)
  }

  async last(symbol: string): Promise<StrategyAction | null> {
    return await this.strategyRepository.last(symbol)
  }

  async list(symbol?: string): Promise<StrategyAction[]> {
    return this.strategyRepository.list(symbol)
  }

  async listOpportunities(symbol?: string): Promise<StrategyAction[]> {
    return this.strategyRepository.listOpportunities(symbol)
  }

  async getStrategyAnalysis(
    symbol: string,
    interval: TimeInterval,
  ): Promise<StrategyAnalysis> {
    const prices: StrategyAction[] =
      await this.strategyRepository.getPriceGraph(symbol, interval)
    const pricesReducedData: StrategyAction[] = reduceRecordsData(prices)

    const opportunities: StrategyAction[] =
      await this.strategyRepository.getOpportunitiesGraph(symbol, interval)
    const opportunitiesReducedData: StrategyAction[] =
      reduceRecordsData(opportunities)

    return {
      symbol: symbol,
      prices: pricesReducedData.map((p: StrategyAction) => ({
        amount: p.price,
        date: p.createdAt,
      })),
      opportunities: opportunitiesReducedData.map((o: StrategyAction) => ({
        signal: o.signal,
        date: o.createdAt,
      })),
    }
  }
}
