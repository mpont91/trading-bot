import { BinanceApi } from '../../application/api/binance-api'
import { ApiService } from './api-service'
import { CommissionEquityCreate } from '../models/commission-equity'
import { ApiSettings } from '../types/settings'

export class ApiSpotService extends ApiService {
  constructor(
    settings: ApiSettings,
    private readonly binanceApi: BinanceApi,
  ) {
    super(settings, binanceApi)
  }

  async getCommissionEquity(): Promise<CommissionEquityCreate> {
    return this.binanceApi.getCommissionEquity()
  }
}
