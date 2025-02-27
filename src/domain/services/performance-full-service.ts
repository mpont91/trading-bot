import { Performance } from '../types/performance'
import { PerformanceService } from './performance-service'
import { PerformanceServiceInterface } from './performance-service-interface'

export class PerformanceFullService implements PerformanceServiceInterface {
  constructor(
    private readonly performanceSpotService: PerformanceService,
    private readonly performanceFuturesService: PerformanceService,
  ) {}
  async getPerformance(): Promise<Performance> {
    const [spot, futures] = await Promise.all([
      this.performanceSpotService.getPerformance(),
      this.performanceFuturesService.getPerformance(),
    ])

    return {
      trades: spot.trades + futures.trades,
      success: spot.success + futures.success,
      failed: spot.failed + futures.failed,
      pnl: spot.pnl + futures.pnl,
      fees: spot.fees + futures.fees,
      net: spot.net + futures.net,
    }
  }
}
