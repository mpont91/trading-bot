import { Performance } from '../types/performance'
import { TradeService } from './trade-service'
import { PerformanceServiceInterface } from './performance-service-interface'

export class PerformanceService implements PerformanceServiceInterface {
  constructor(private readonly tradeService: TradeService) {}
  async getPerformance(): Promise<Performance> {
    return this.tradeService.getPerformance()
  }
}
