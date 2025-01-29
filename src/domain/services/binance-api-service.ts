import { BinanceApi } from '../../application/api/binance-api'
import { Kline, KlineInterval } from '../types/kline'

export class BinanceApiService {
  constructor(private readonly binanceApi: BinanceApi) {}

  async getPrice(symbol: string): Promise<number> {
    return this.binanceApi.getPrice(symbol)
  }

  async getPriceHistory(symbol: string): Promise<number[]> {
    const interval: KlineInterval = 1
    const limit: number = 10
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
