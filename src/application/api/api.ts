import { Balance } from '../../domain/types/balance'
import { Symbol } from '../../domain/types/symbol'
import { OrderRequest } from '../../domain/types/order-request'
import { OrderCreate } from '../../domain/models/order'
import { Position } from '../../domain/types/position'

export interface Api {
  getBalance(): Promise<Balance>
  getSymbol(symbol: string): Promise<Symbol>
  submitOrder(orderRequest: OrderRequest): Promise<string>
  getOrder(symbol: string, orderId: string): Promise<OrderCreate>
  getPosition(symbol: string): Promise<Position | null>
}
