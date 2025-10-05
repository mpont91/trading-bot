import { Balance } from '../types/balance'
import { Api } from '../../application/api'
import { Symbol } from '../types/symbol'
import { OrderRequest } from '../models/order'
import { OrderCreate } from '../models/order'
import { Candle, TimeFrame } from '../types/candle'
import { HistorySettings } from '../types/settings'
import { CommissionEquityCreate } from '../models/commission-equity'
import { EquityCreate } from '../models/equity'
import { Coin } from '../types/coin'

export class ApiService {
  constructor(
    private readonly settings: HistorySettings,
    private readonly api: Api,
  ) {}

  async getCoins(): Promise<Coin[]> {
    return this.api.getCoins()
  }

  async getEquity(): Promise<EquityCreate> {
    return this.api.getEquity()
  }

  async getCommissionEquity(): Promise<CommissionEquityCreate> {
    return this.api.getCommissionEquity()
  }

  async getBalance(): Promise<Balance> {
    return this.api.getBalance()
  }

  async getPrice(symbol: string): Promise<number> {
    return this.api.getPrice(symbol)
  }

  async getCandles(symbol: string): Promise<Candle[]> {
    const timeFrame: TimeFrame = this.settings.timeFrame
    const candles: number = this.settings.candles
    const end: Date = new Date()
    const start: Date = new Date(
      end.getTime() - candles * timeFrame * 60 * 1000,
    )
    return this.api.getCandles(symbol, timeFrame, start, end)
  }

  async getCandlesHistorical(
    symbol: string,
    timeFrame: TimeFrame,
    start: Date,
    end: Date,
  ): Promise<Candle[]> {
    let candles: Candle[] = []
    let startDate: Date = new Date(start.getTime())

    while (startDate < end) {
      const chunk: Candle[] = await this.api.getCandles(
        symbol,
        timeFrame,
        startDate,
        end,
      )

      if (chunk.length === 0) {
        break
      }

      candles = candles.concat(chunk)

      const lastCandle: Candle = chunk[chunk.length - 1]
      const lastCandleTime: number = lastCandle.time.getTime()

      startDate = new Date(lastCandleTime + timeFrame * 60 * 1000)
    }

    return candles.filter((candle: Candle): boolean => candle.time <= end)
  }

  async getSymbol(symbol: string): Promise<Symbol> {
    return this.api.getSymbol(symbol)
  }

  async submitOrder(orderRequest: OrderRequest): Promise<string> {
    return this.api.submitOrder(orderRequest)
  }

  async getOrder(symbol: string, orderId: string): Promise<OrderCreate> {
    return this.api.getOrder(symbol, orderId)
  }
}
