import { OrderRepository } from '../repositories/order-repository'
import { Order, OrderCreate } from '../models/order'

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async store(orderCreate: OrderCreate): Promise<void> {
    await this.orderRepository.create(orderCreate)
  }

  async getLastMany(): Promise<Order[]> {
    return this.orderRepository.getLastMany()
  }

  async getLastOrderForSymbol(symbol: string): Promise<Order | null> {
    return this.orderRepository.getLastOrderForSymbol(symbol)
  }
}
