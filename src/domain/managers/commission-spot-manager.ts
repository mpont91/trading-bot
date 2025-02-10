import { ManagerInterface } from './manager-interface'
import { CommissionEquityService } from '../services/commission-equity-service'
import { CommissionEquityCreate } from '../models/commission-equity'
import { ApiSpotService } from '../services/api-spot-service'

export class CommissionSpotManager implements ManagerInterface {
  constructor(
    private readonly apiSpotService: ApiSpotService,
    private readonly commissionEquityService: CommissionEquityService,
  ) {}
  async start(): Promise<void> {
    const commissionEquityCreate: CommissionEquityCreate =
      await this.apiSpotService.getCommissionEquity()
    await this.commissionEquityService.store(commissionEquityCreate)
  }
}
