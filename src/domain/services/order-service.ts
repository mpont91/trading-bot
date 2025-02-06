import { OrderRepository } from '../repositories/order-repository'
import { Order, OrderCreate } from '../models/order'

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async store(orderCreate: OrderCreate): Promise<void> {
    await this.orderRepository.create(orderCreate)
  }

  async getLatest(): Promise<Order[]> {
    return await this.orderRepository.getLatest()
  }
}
