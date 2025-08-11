import { ManagerInterface } from './manager-interface'
import { CommissionEquityService } from '../services/commission-equity-service'
import { CommissionEquityCreate } from '../models/commission-equity'
import { ApiService } from '../services/api-service'

export class CommissionManager implements ManagerInterface {
  constructor(
    private readonly apiService: ApiService,
    private readonly commissionEquityService: CommissionEquityService,
  ) {}
  async start(): Promise<void> {
    const commissionEquityCreate: CommissionEquityCreate =
      await this.apiService.getCommissionEquity()
    await this.commissionEquityService.store(commissionEquityCreate)
  }
}
