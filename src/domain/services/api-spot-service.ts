import { BinanceApi } from '../../application/api/binance-api'
import { Kline, KlineInterval } from '../types/kline'
import { ApiSettings } from '../../application/settings'
import { ApiService } from './api-service'
import { CommissionEquityCreate } from '../models/commission-equity'

export class ApiSpotService extends ApiService {
  constructor(
    private readonly settings: ApiSettings,
    private readonly binanceApi: BinanceApi,
  ) {
    super(binanceApi)
  }

  async getCommissionEquity(): Promise<CommissionEquityCreate> {
    return this.binanceApi.getCommissionEquity()
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
