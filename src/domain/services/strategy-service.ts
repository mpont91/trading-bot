import { StrategyRepository } from '../repositories/strategy-repository'
import { Strategy, StrategyCreate } from '../models/strategy'
import {
  convertSymbolToFuturesBaseCurrency,
  convertSymbolToSpotBaseCurrency,
  isSymbolForSpotBaseCurrency,
} from '../helpers/symbol-helper'

export class StrategyService {
  constructor(private readonly strategyRepository: StrategyRepository) {}

  async create(strategy: StrategyCreate): Promise<void> {
    await this.strategyRepository.create(strategy)
  }

  async getLatest(): Promise<Strategy[]> {
    return this.strategyRepository.getLatest()
  }

  async getLatestForSymbol(symbol: string): Promise<Strategy> {
    const needConversion: boolean = isSymbolForSpotBaseCurrency(symbol)

    if (needConversion) {
      symbol = convertSymbolToFuturesBaseCurrency(symbol)
    }

    const strategy: Strategy =
      await this.strategyRepository.getLatestForSymbol(symbol)

    if (needConversion) {
      strategy.symbol = convertSymbolToSpotBaseCurrency(strategy.symbol)
    }

    return strategy
  }

  async getLatestOpportunities(): Promise<Strategy[]> {
    return this.strategyRepository.getLatestOpportunities()
  }
}
