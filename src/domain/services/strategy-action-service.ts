import { StrategyActionRepository } from '../repositories/strategy-action-repository'
import { StrategyAction, StrategyActionCreate } from '../models/strategy-action'
import { StrategyAnalysis } from '../types/strategy-analysis'
import { TimeInterval } from '../types/time-interval'
import { reduceRecordsData } from '../helpers/graph-helper'
import { StrategyReportService } from './strategy-report-service'

export class StrategyActionService {
  constructor(
    private readonly strategyActionRepository: StrategyActionRepository,
    private readonly decisionService: StrategyReportService,
  ) {}

  async calculateAndCreate(symbol: string): Promise<StrategyAction> {
    return this.create(await this.decisionService.fetchAndCalculate(symbol))
  }

  async create(strategy: StrategyActionCreate): Promise<StrategyAction> {
    return this.strategyActionRepository.create(strategy)
  }

  async last(symbol: string): Promise<StrategyAction | null> {
    return await this.strategyActionRepository.last(symbol)
  }

  async list(symbol?: string): Promise<StrategyAction[]> {
    return this.strategyActionRepository.list(symbol)
  }

  async listOpportunities(symbol?: string): Promise<StrategyAction[]> {
    return this.strategyActionRepository.listOpportunities(symbol)
  }

  async getStrategyAnalysis(
    symbol: string,
    interval: TimeInterval,
  ): Promise<StrategyAnalysis> {
    const prices: StrategyAction[] =
      await this.strategyActionRepository.getPriceGraph(symbol, interval)
    const pricesReducedData: StrategyAction[] = reduceRecordsData(prices)

    const opportunities: StrategyAction[] =
      await this.strategyActionRepository.getOpportunitiesGraph(
        symbol,
        interval,
      )
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
