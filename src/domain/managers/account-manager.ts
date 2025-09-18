import { ManagerInterface } from './manager-interface'
import { EquityService } from '../services/equity-service'
import { ApiService } from '../services/api-service'
import { EquityCreate } from '../models/equity'

export class AccountManager implements ManagerInterface {
  constructor(
    private readonly apiService: ApiService,
    private readonly equityService: EquityService,
  ) {}
  async start(): Promise<void> {
    const equity: EquityCreate = await this.apiService.getEquity()
    await this.equityService.store(equity)
  }
}
