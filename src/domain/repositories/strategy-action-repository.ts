import { StrategyAction, StrategyActionCreate } from '../models/strategy-action'
import { TimeInterval } from '../types/time-interval'

export interface StrategyActionRepository {
  create(strategyAction: StrategyActionCreate): Promise<StrategyAction>
  last(symbol: string): Promise<StrategyAction | null>
  getPriceGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<StrategyAction[]>
  getOpportunitiesGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<StrategyAction[]>
}
