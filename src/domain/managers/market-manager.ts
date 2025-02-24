import { ManagerInterface } from './manager-interface'
import { ApiSpotService } from '../services/api-spot-service'
import { Kline } from '../types/kline'
import { PredictionService } from '../services/prediction-service'
import { StrategyService } from '../services/strategy-service'
import { StrategyCreate } from '../models/strategy'

export class MarketManager implements ManagerInterface {
  constructor(
    private readonly symbols: string[],
    private readonly apiSpotService: ApiSpotService,
    private readonly predictionService: PredictionService,
    private readonly strategyService: StrategyService,
  ) {}
  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      const klines: Kline[] = await this.apiSpotService.getKlineHistory(symbol)
      const strategy: StrategyCreate = await this.predictionService.predict(
        symbol,
        klines,
      )
      await this.strategyService.create(strategy)
    }
  }
}
