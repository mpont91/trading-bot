import { ManagerInterface } from './manager-interface'
import { StrategyService } from '../services/strategy-service'
import { StrategyCreate } from '../models/strategy'
import { IndicatorService } from '../services/indicator-service'

export class MarketManager implements ManagerInterface {
  constructor(
    private readonly symbols: string[],
    private readonly indicatorService: IndicatorService,
    private readonly strategyService: StrategyService,
  ) {}
  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      await this.indicatorService.storeAll(symbol)
      const strategy: StrategyCreate = await this.strategyService.create(symbol)
      await this.strategyService.store(strategy)
    }
  }
}
