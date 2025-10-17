import { Performance } from '../types/performance'
import { TradeRepository } from '../repositories/trade-repository'

export class PerformanceService {
  constructor(private readonly tradeRepository: TradeRepository) {}
  async getPerformance(symbol?: string): Promise<Performance> {
    return this.tradeRepository.getPerformance(symbol)
  }
}
