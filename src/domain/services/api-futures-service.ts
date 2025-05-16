import { BitmartApi } from '../../application/api/bitmart-api'
import { ApiSettings } from '../types/settings'
import { ApiService } from './api-service'

export class ApiFuturesService extends ApiService {
  constructor(
    settings: ApiSettings,
    private readonly bitmartApi: BitmartApi,
  ) {
    super(settings, bitmartApi)
  }

  async setLeverage(symbol: string, leverage: number): Promise<void> {
    await this.bitmartApi.setLeverage(symbol, leverage)
  }
}
