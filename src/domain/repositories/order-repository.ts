import { Order, OrderCreate } from '../models/order'

export interface OrderRepository {
  create(orderCreate: OrderCreate): Promise<Order>
  list(): Promise<Order[]>
  last(symbol: string): Promise<Order | null>
}
