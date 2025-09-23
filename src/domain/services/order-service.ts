import { OrderRepository } from '../repositories/order-repository'
import { Order, OrderCreate, OrderRequest } from '../models/order'
import { ApiService } from './api-service'

export class OrderService {
  constructor(
    private readonly apiService: ApiService,
    private readonly orderRepository: OrderRepository,
  ) {}

  async submitOrder(orderRequest: OrderRequest): Promise<Order> {
    const orderId: string = await this.apiService.submitOrder(orderRequest)
    const order: OrderCreate = await this.apiService.getOrder(
      orderRequest.symbol,
      orderId,
    )
    return this.store(order)
  }

  async store(orderCreate: OrderCreate): Promise<Order> {
    return this.orderRepository.create(orderCreate)
  }

  async list(): Promise<Order[]> {
    return this.orderRepository.list()
  }

  async get(id: number): Promise<Order | null> {
    return this.orderRepository.get(id)
  }
}
