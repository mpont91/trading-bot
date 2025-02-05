import { BitmartApi } from '../../application/api/bitmart-api'
import { ApiService } from './api-service'

export class BitmartApiService extends ApiService {
  constructor(private readonly bitmartApi: BitmartApi) {
    super(bitmartApi)
  }

  async setLeverage(symbol: string, leverage: number): Promise<void> {
    await this.bitmartApi.setLeverage(symbol, leverage)
  }
}
