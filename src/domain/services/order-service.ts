import { OrderRepository } from '../repositories/order-repository'
import { Order, OrderCreate, OrderRequest } from '../models/order'
import { ApiService } from './api-service'

export class OrderService {
  constructor(
    private readonly apiService: ApiService,
    private readonly orderRepository: OrderRepository,
  ) {}

  async submitOrder(orderRequest: OrderRequest): Promise<Order> {
    //TODO: Is possible to save the order without having to call getOrder again?
    const orderId: string = await this.apiService.submitOrder(orderRequest)

    return this.create(
      await this.apiService.getOrder(orderRequest.symbol, orderId),
    )
  }

  async create(orderCreate: OrderCreate): Promise<Order> {
    return this.orderRepository.create(orderCreate)
  }

  async list(): Promise<Order[]> {
    return this.orderRepository.list()
  }

  async get(id: number): Promise<Order | null> {
    return this.orderRepository.get(id)
  }
}
