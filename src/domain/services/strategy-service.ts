import { StrategyRepository } from '../repositories/strategy-repository'
import { Strategy, StrategyCreate } from '../models/strategy'

export class StrategyService {
  constructor(private readonly strategyRepository: StrategyRepository) {}

  async create(strategy: StrategyCreate): Promise<void> {
    await this.strategyRepository.create(strategy)
  }

  async getLatest(): Promise<Strategy[]> {
    return this.strategyRepository.getLatest()
  }

  async getLatestForSymbol(symbol: string): Promise<Strategy> {
    return this.strategyRepository.getLatestForSymbol(symbol)
  }
}
