import { Balance } from '../domain/types/balance'
import { Symbol } from '../domain/types/symbol'
import { OrderRequest, OrderCreate } from '../domain/models/order'
import { Kline, TimeFrame } from '../domain/types/kline'
import { CommissionEquityCreate } from '../domain/models/commission-equity'
import { EquityCreate } from '../domain/models/equity'
import { Coin } from '../domain/types/coin'

export interface Api {
  getCoins(): Promise<Coin[]>
  getEquity(): Promise<EquityCreate>
  getCommissionEquity(): Promise<CommissionEquityCreate>
  getBalance(): Promise<Balance>
  getPrice(symbol: string): Promise<number>
  getKline(
    symbol: string,
    timeFrame: TimeFrame,
    start: Date,
    end: Date,
  ): Promise<Kline[]>
  getSymbol(symbol: string): Promise<Symbol>
  submitOrder(orderRequest: OrderRequest): Promise<string>
  getOrder(symbol: string, orderId: string): Promise<OrderCreate>
}
