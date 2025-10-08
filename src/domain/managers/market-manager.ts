import { ManagerInterface } from './manager-interface'
import { MarketService } from '../services/market-service'

export class MarketManager implements ManagerInterface {
  constructor(
    private readonly symbols: string[],
    private readonly marketService: MarketService,
  ) {}
  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      await this.marketService.execute(symbol)
    }
  }
}
