import { Balance } from '../../domain/types/balance'
import { Symbol } from '../../domain/types/symbol'
import { OrderRequest } from '../../domain/types/order-request'

export interface Api {
  getBalance(): Promise<Balance>
  getSymbol(symbol: string): Promise<Symbol>
  submitOrder(orderRequest: OrderRequest): Promise<void>
}
