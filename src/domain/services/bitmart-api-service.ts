import { BitmartApi } from '../../application/api/bitmart-api'
import { Balance } from '../types/balance'

export class BitmartApiService {
  constructor(private readonly bitmartApi: BitmartApi) {}
  async getBalance(): Promise<Balance> {
    return await this.bitmartApi.getBalance()
  }
}
