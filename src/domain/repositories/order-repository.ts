import { Order, OrderCreate } from '../models/order'

export interface OrderRepository {
  create(orderCreate: OrderCreate): Promise<void>
  getLatest(): Promise<Order[]>
}
