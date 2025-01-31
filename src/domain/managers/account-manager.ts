import { ManagerInterface } from './manager-interface'
import { EquityService } from '../services/equity-service'
import { ApiService } from '../services/api-service'
import { Balance } from '../types/balance'

export class AccountManager implements ManagerInterface {
  constructor(
    private readonly apiService: ApiService,
    private readonly equityService: EquityService,
  ) {}
  async start(): Promise<void> {
    const balance: Balance = await this.apiService.getBalance()
    await this.equityService.store(balance.equity)
  }
}
