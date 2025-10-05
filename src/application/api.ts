import { Balance } from '../domain/types/balance'
import { Symbol } from '../domain/types/symbol'
import { OrderRequest, OrderCreate } from '../domain/models/order'
import { Candle, TimeFrame } from '../domain/types/Candle'
import { CommissionEquityCreate } from '../domain/models/commission-equity'
import { EquityCreate } from '../domain/models/equity'
import { Coin } from '../domain/types/coin'

export interface Api {
  getCoins(): Promise<Coin[]>
  getEquity(): Promise<EquityCreate>
  getCommissionEquity(): Promise<CommissionEquityCreate>
  getBalance(): Promise<Balance>
  getPrice(symbol: string): Promise<number>
  getCandles(
    symbol: string,
    timeFrame: TimeFrame,
    start: Date,
    end: Date,
  ): Promise<Candle[]>
  getSymbol(symbol: string): Promise<Symbol>
  submitOrder(orderRequest: OrderRequest): Promise<string>
  getOrder(symbol: string, orderId: string): Promise<OrderCreate>
}
