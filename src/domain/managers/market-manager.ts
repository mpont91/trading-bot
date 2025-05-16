import { ManagerInterface } from './manager-interface'
import { Kline } from '../types/kline'
import { StrategyService } from '../services/strategy-service'
import { StrategyCreate } from '../models/strategy'
import { IndicatorService } from '../services/indicator-service'
import { CombinationStrategy } from '../strategies/combination-strategy'
import { ApiService } from '../services/api-service'

export class MarketManager implements ManagerInterface {
  constructor(
    private readonly symbols: string[],
    private readonly apiService: ApiService,
    private readonly indicatorService: IndicatorService,
    private readonly combinationStrategy: CombinationStrategy,
    private readonly strategyService: StrategyService,
  ) {}
  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      const klines: Kline[] = await this.apiService.getKlineHistory(symbol)
      await this.indicatorService.calculateAndCreateAll(symbol, klines)
      const strategy: StrategyCreate =
        await this.combinationStrategy.createStrategy(symbol)
      await this.strategyService.create(strategy)
    }
  }
}
