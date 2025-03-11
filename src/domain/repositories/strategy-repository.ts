import { Strategy, StrategyCreate } from '../models/strategy'

export interface StrategyRepository {
  create(strategy: StrategyCreate): Promise<void>
  getLastForSymbol(symbol: string): Promise<Strategy>
  getLastManyForSymbol(symbol: string): Promise<Strategy[]>
  getLastManyOpportunitiesForSymbol(symbol: string): Promise<Strategy[]>
  getLastManyForEachSymbol(): Promise<Strategy[]>
  getLastManyOpportunitiesForEachSymbol(): Promise<Strategy[]>
}
