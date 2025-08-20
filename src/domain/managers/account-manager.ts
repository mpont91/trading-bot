import { ManagerInterface } from './manager-interface'
import { EquityService } from '../services/equity-service'
import { ApiService } from '../services/api-service'
import { Balance } from '../types/balance'
import { PnlService } from '../services/pnl-service'
import { PerformanceService } from '../services/performance-service'
import { Performance } from '../types/performance'

export class AccountManager implements ManagerInterface {
  constructor(
    private readonly apiService: ApiService,
    private readonly equityService: EquityService,
    private readonly pnlService: PnlService,
    private readonly performanceService: PerformanceService,
  ) {}
  async start(): Promise<void> {
    const balance: Balance = await this.apiService.getBalance()
    await this.equityService.store(balance.equity)
    const performance: Performance =
      await this.performanceService.getPerformance()
    await this.pnlService.store(performance.net)
  }
}
