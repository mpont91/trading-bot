import { ManagerInterface } from './manager-interface'
import { StrategyActionService } from '../services/strategy-action-service'
import { IndicatorService } from '../services/indicator-service'

export class MarketManager implements ManagerInterface {
  constructor(
    private readonly symbols: string[],
    private readonly indicatorService: IndicatorService,
    private readonly strategyService: StrategyActionService,
  ) {}
  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      await this.indicatorService.fetchAndCalculateAndCreateAll(symbol)
      await this.strategyService.calculateAndCreate(symbol)
    }
  }
}
