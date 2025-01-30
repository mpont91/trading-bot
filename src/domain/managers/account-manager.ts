import { ManagerInterface } from './manager-interface'
import { EquityService } from '../services/equity-service'

export class AccountManager implements ManagerInterface {
  constructor(private readonly equityService: EquityService) {}
  async start(): Promise<void> {
    const equity: number = Math.random() * 1000 // TODO: Fetch equity
    await this.equityService.store(equity)
  }
}
