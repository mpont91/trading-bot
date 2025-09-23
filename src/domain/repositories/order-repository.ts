import { Order, OrderCreate } from '../models/order'

export interface OrderRepository {
  create(orderCreate: OrderCreate): Promise<Order>
  get(id: number): Promise<Order | null>
  list(): Promise<Order[]>
  last(symbol: string): Promise<Order | null>
}
