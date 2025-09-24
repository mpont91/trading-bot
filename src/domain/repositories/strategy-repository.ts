import { Strategy, StrategyCreate } from '../models/strategy'
import { TimeInterval } from '../types/time-interval'

export interface StrategyRepository {
  create(strategy: StrategyCreate): Promise<Strategy>
  last(symbol: string): Promise<Strategy | null>
  list(symbol?: string): Promise<Strategy[]>
  listOpportunities(symbol?: string): Promise<Strategy[]>
  getPriceGraph(symbol: string, interval: TimeInterval): Promise<Strategy[]>
  getOpportunitiesGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<Strategy[]>
}
