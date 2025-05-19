import { StrategyCreate } from '../models/strategy'

export interface StrategyInterface {
  createStrategy(symbol: string): Promise<StrategyCreate>
}
