import { StrategyRepository } from '../repositories/strategy-repository'
import { Strategy, StrategyCreate } from '../models/strategy'

export class StrategyService {
  constructor(private readonly strategyRepository: StrategyRepository) {}

  async create(strategy: StrategyCreate): Promise<void> {
    await this.strategyRepository.create(strategy)
  }
  async get(symbol: string): Promise<Strategy> {
    return this.strategyRepository.get(symbol)
  }
}
