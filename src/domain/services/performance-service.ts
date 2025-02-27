import { Performance } from '../types/performance'
import { TradeService } from './trade-service'

export class PerformanceService {
  constructor(private readonly tradeService: TradeService) {}
  async getPerformance(): Promise<Performance> {
    return this.tradeService.getPerformance()
  }
}
