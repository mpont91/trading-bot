import { Balance } from '../../domain/types/balance'
import { Symbol } from '../../domain/types/symbol'
import { OrderRequest, OrderCreate } from '../../domain/models/order'
import { Position } from '../../domain/types/position'
import { Kline, KlineInterval } from '../../domain/types/kline'

export interface Api {
  getBalance(): Promise<Balance>
  getPrice(symbol: string): Promise<number>
  getKline(
    symbol: string,
    interval: KlineInterval,
    start: Date,
    end: Date,
  ): Promise<Kline[]>
  getSymbol(symbol: string): Promise<Symbol>
  submitOrder(orderRequest: OrderRequest): Promise<string>
  getOrder(symbol: string, orderId: string): Promise<OrderCreate>
  getPosition(symbol: string): Promise<Position | null>
}
