import { StrategyAction, StrategyActionCreate } from '../models/strategy-action'
import { TimeInterval } from '../types/time-interval'

export interface StrategyActionRepository {
  create(strategyAction: StrategyActionCreate): Promise<StrategyAction>
  last(symbol: string): Promise<StrategyAction | null>
  list(symbol?: string): Promise<StrategyAction[]>
  listOpportunities(symbol?: string): Promise<StrategyAction[]>
  getPriceGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<StrategyAction[]>
  getOpportunitiesGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<StrategyAction[]>
}
