import { Balance } from '../types/balance'
import { Api } from '../../application/api/api'
import { Symbol } from '../types/symbol'
import { OrderRequest } from '../types/order-request'

export class ApiService {
  constructor(private readonly api: Api) {}

  async getBalance(): Promise<Balance> {
    return this.api.getBalance()
  }

  async getSymbol(symbol: string): Promise<Symbol> {
    return this.api.getSymbol(symbol)
  }

  async submitOrder(orderRequest: OrderRequest): Promise<void> {
    return this.api.submitOrder(orderRequest)
  }
}
