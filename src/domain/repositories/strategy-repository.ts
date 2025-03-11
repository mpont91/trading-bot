import { Strategy, StrategyCreate } from '../models/strategy'
import { TimeInterval } from '../types/time-interval'

export interface StrategyRepository {
  create(strategy: StrategyCreate): Promise<void>
  getLastForSymbol(symbol: string): Promise<Strategy>
  getLastManyForSymbol(symbol: string): Promise<Strategy[]>
  getLastManyOpportunitiesForSymbol(symbol: string): Promise<Strategy[]>
  getLastManyForEachSymbol(): Promise<Strategy[]>
  getLastManyOpportunitiesForEachSymbol(): Promise<Strategy[]>
  getPriceGraph(symbol: string, interval: TimeInterval): Promise<Strategy[]>
  getOpportunitiesGraph(
    symbol: string,
    interval: TimeInterval,
  ): Promise<Strategy[]>
}
