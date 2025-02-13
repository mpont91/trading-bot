import { BinanceApi } from '../../application/api/binance-api'
import { Kline, KlineInterval } from '../types/kline'
import { ApiService } from './api-service'
import { CommissionEquityCreate } from '../models/commission-equity'
import { ApiSettings } from '../types/settings'

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

  async getKlineHistory(symbol: string): Promise<Kline[]> {
    const interval: KlineInterval = this.settings.klineHistoryInterval
    const limit: number = this.settings.klineHistoryLimit
    const end: Date = new Date()
    const start: Date = new Date(end.getTime() - limit * interval * 60 * 1000)
    return this.binanceApi.getKline(symbol, interval, start, end)
  }
}
