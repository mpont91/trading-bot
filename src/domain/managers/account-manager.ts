import { ManagerInterface } from './manager-interface'
import { EquityService } from '../services/equity-service'
import { ApiService } from '../services/api-service'
import { EquityCreate } from '../models/equity'
import { CommissionEquityService } from '../services/commission-equity-service'
import { CommissionEquityCreate } from '../models/commission-equity'

export class AccountManager implements ManagerInterface {
  constructor(
    private readonly apiService: ApiService,
    private readonly equityService: EquityService,
    private readonly commissionEquityService: CommissionEquityService,
  ) {}
  async start(): Promise<void> {
    const equity: EquityCreate = await this.apiService.getEquity()
    await this.equityService.store(equity)
    const commissionEquityCreate: CommissionEquityCreate =
      await this.apiService.getCommissionEquity()
    await this.commissionEquityService.store(commissionEquityCreate)
  }
}
