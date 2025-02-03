import { ManagerInterface } from './manager-interface'
import { CommissionEquityService } from '../services/commission-equity-service'
import { CommissionEquityCreate } from '../models/commission-equity'
import { BinanceApiService } from '../services/binance-api-service'

export class CommissionSpotManager implements ManagerInterface {
  constructor(
    private readonly binanceApiService: BinanceApiService,
    private readonly commissionEquityService: CommissionEquityService,
  ) {}
  async start(): Promise<void> {
    const commissionEquityCreate: CommissionEquityCreate =
      await this.binanceApiService.getCommissionEquity()
    await this.commissionEquityService.store(commissionEquityCreate)
  }
}
