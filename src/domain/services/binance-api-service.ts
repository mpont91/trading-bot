import { BinanceApi } from '../../application/api/binance-api'
import { Kline, KlineInterval } from '../types/kline'
import { settings, ApiSettings } from '../../application/settings'
import { ApiService } from './api-service'

export class BinanceApiService extends ApiService {
  private readonly settings: ApiSettings = settings.api
  constructor(private readonly binanceApi: BinanceApi) {
    super(binanceApi)
  }

  async getPrice(symbol: string): Promise<number> {
    return this.binanceApi.getPrice(symbol)
  }

  async getPriceHistory(symbol: string): Promise<number[]> {
    const interval: KlineInterval = this.settings.priceHistoryKlineInterval
    const limit: number = this.settings.priceHistoryKlineLimit
    const end: Date = new Date()
    const start: Date = new Date(end.getTime() - limit * interval * 60 * 1000)
    const response: Kline[] = await this.binanceApi.getKline(
      symbol,
      interval,
      start,
      end,
    )

    return response.map((kline: Kline) => kline.closePrice)
  }
}
