import { ManagerInterface } from './manager-interface'
import { EquityService } from '../services/equity-service'
import { CommissionEquityService } from '../services/commission-equity-service'

export class AccountManager implements ManagerInterface {
  constructor(
    private readonly equityService: EquityService,
    private readonly commissionEquityService: CommissionEquityService,
  ) {}
  async start(): Promise<void> {
    await this.equityService.fetchAndCreate()
    await this.commissionEquityService.fetchAndCreate()
  }
}
