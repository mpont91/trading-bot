import { ManagerInterface } from './manager-interface'
import { CommissionEquityService } from '../services/commission-equity-service'
import { CommissionEquityCreate } from '../models/commission-equity'
import { ApiSpotService } from '../services/api-spot-service'

export class CommissionSpotManager implements ManagerInterface {
  constructor(
    private readonly binanceApiService: ApiSpotService,
    private readonly commissionEquityService: CommissionEquityService,
  ) {}
  async start(): Promise<void> {
    const commissionEquityCreate: CommissionEquityCreate =
      await this.binanceApiService.getCommissionEquity()
    await this.commissionEquityService.store(commissionEquityCreate)
  }
}
