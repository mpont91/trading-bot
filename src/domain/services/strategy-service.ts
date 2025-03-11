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

  async getLastForSymbol(symbol: string): Promise<Strategy> {
    const needConversion: boolean = isSymbolForSpotBaseCurrency(symbol)

    if (needConversion) {
      symbol = convertSymbolToFuturesBaseCurrency(symbol)
    }

    const strategy: Strategy =
      await this.strategyRepository.getLastForSymbol(symbol)

    if (needConversion) {
      strategy.symbol = convertSymbolToSpotBaseCurrency(strategy.symbol)
    }

    return strategy
  }

  async getLastManyForSymbol(symbol: string): Promise<Strategy[]> {
    return this.strategyRepository.getLastManyForSymbol(symbol)
  }

  async getLastManyOpportunitiesForSymbol(symbol: string): Promise<Strategy[]> {
    return this.strategyRepository.getLastManyOpportunitiesForSymbol(symbol)
  }

  async getLastManyForEachSymbol(): Promise<Strategy[]> {
    return this.strategyRepository.getLastManyForEachSymbol()
  }

  async getLastManyOpportunitiesForEachSymbol(): Promise<Strategy[]> {
    return this.strategyRepository.getLastManyOpportunitiesForEachSymbol()
  }
}
