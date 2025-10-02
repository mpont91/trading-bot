import { ManagerInterface } from './manager-interface'
import { StrategyService } from '../services/strategy-service'
import { IndicatorService } from '../services/indicator-service'

export class MarketManager implements ManagerInterface {
  constructor(
    private readonly symbols: string[],
    private readonly indicatorService: IndicatorService,
    private readonly strategyService: StrategyService,
  ) {}
  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      await this.indicatorService.calculateAndCreateAll(symbol)
      await this.strategyService.calculateAndCreate(symbol)
    }
  }
}
