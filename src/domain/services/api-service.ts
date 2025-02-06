import { Balance } from '../types/balance'
import { Api } from '../../application/api/api'
import { Symbol } from '../types/symbol'
import { OrderRequest } from '../models/order'
import { OrderCreate } from '../models/order'
import { Position } from '../types/position'

export class ApiService {
  constructor(private readonly api: Api) {}

  async getBalance(): Promise<Balance> {
    return this.api.getBalance()
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

  async getPosition(symbol: string): Promise<Position | null> {
    return this.api.getPosition(symbol)
  }
}
