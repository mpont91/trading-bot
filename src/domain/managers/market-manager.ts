import { ManagerInterface } from './manager-interface'
import { ApiSpotService } from '../services/api-spot-service'
import { IndicatorService } from '../services/indicator-service'
import { Kline } from '../types/kline'
import { IndicatorCreate } from '../models/indicator'

export class MarketManager implements ManagerInterface {
  constructor(
    private readonly symbols: string[],
    private readonly apiSpotService: ApiSpotService,
    private readonly indicatorService: IndicatorService,
  ) {}
  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      const klines: Kline[] = await this.apiSpotService.getKlineHistory(symbol)
      const indicators: IndicatorCreate[] = this.indicatorService.calculate(
        symbol,
        klines,
      )
      await this.indicatorService.store(indicators)
    }
  }
}
