import { ManagerInterface } from './manager-interface'
import { ExecutionService } from '../services/execution-service'

export class TradingManager implements ManagerInterface {
  constructor(
    private readonly symbols: string[],
    private readonly executionService: ExecutionService,
  ) {}

  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      await this.executionService.execute(symbol)
    }
  }
}
