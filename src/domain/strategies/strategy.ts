import { StrategyConditions } from '../types/strategy-conditions'

export interface Strategy {
  evaluateStrategyConditions(): StrategyConditions
}
