import { Balance } from '../types/balance'
import { Api } from '../../application/api/api'

export class ApiService {
  constructor(private readonly api: Api) {}

  async getBalance(): Promise<Balance> {
    return this.api.getBalance()
  }
}
