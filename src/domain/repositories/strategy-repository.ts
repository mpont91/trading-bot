import { Strategy, StrategyCreate } from '../models/strategy'

export interface StrategyRepository {
  create(strategy: StrategyCreate): Promise<void>
  get(symbol: string): Promise<Strategy>
}
