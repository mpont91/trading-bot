import { ManagerInterface } from './manager-interface'
import { ApiSpotService } from '../services/api-spot-service'
import { PredictionService } from '../services/prediction-service'
import { Kline } from '../types/kline'
import { IndicatorCreate } from '../models/indicator'

export class MarketManager implements ManagerInterface {
  constructor(
    private readonly apiSpotService: ApiSpotService,
    private readonly predictionService: PredictionService,
  ) {}
  async start(): Promise<void> {
    for (const symbol of ['ETHUSDT']) {
      const klines: Kline[] = await this.apiSpotService.getKlineHistory(symbol)
      const indicators: IndicatorCreate[] =
        this.predictionService.calculateIndicators(symbol, klines)
      await this.predictionService.storeIndicators(indicators)
    }
  }
}
