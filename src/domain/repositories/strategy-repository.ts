import { Strategy, StrategyCreate } from '../models/strategy'

export interface StrategyRepository {
  create(strategy: StrategyCreate): Promise<void>
  getLatest(): Promise<Strategy[]>
  getLatestForSymbol(symbol: string): Promise<Strategy>
  getLatestOpportunities(): Promise<Strategy[]>
}
