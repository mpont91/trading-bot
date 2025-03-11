import { Order, OrderCreate } from '../models/order'

export interface OrderRepository {
  create(orderCreate: OrderCreate): Promise<void>
  getLastMany(): Promise<Order[]>
  getLastOrderForSymbol(symbol: string): Promise<Order | null>
}
