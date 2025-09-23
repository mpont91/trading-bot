import { Balance } from '../types/balance'
import { Api } from '../../application/api'
import { Symbol } from '../types/symbol'
import { OrderRequest } from '../models/order'
import { OrderCreate } from '../models/order'
import { Kline, KlineInterval } from '../types/kline'
import { ApiSettings } from '../types/settings'
import { CommissionEquityCreate } from '../models/commission-equity'
import { EquityCreate } from '../models/equity'
import { Coin } from '../types/coin'

export class ApiService {
  constructor(
    private readonly settings: ApiSettings,
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

  async getKline(symbol: string): Promise<Kline[]> {
    const interval: KlineInterval = this.settings.klineHistoryInterval
    const limit: number = this.settings.klineHistoryLimit
    const end: Date = new Date()
    const start: Date = new Date(end.getTime() - limit * interval * 60 * 1000)
    return this.api.getKline(symbol, interval, start, end)
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
