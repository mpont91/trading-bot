import { Position } from '../types/position'
import { ApiService } from './api-service'
import { InvestmentService } from './investment-service'
import { OrderCreate, OrderRequest } from '../models/order'
import { OrderService } from './order-service'

export abstract class PositionService {
  constructor(
    private readonly apiService: ApiService,
    private readonly investmentService: InvestmentService,
    private readonly orderService: OrderService,
  ) {}

  async getPosition(symbol: string): Promise<Position | null> {
    return this.apiService.getPosition(symbol)
  }

  async openPosition(symbol: string): Promise<void> {
    const quantity: number =
      await this.investmentService.getInvestmentQuantityFromSymbol(symbol)
    const orderRequest: OrderRequest = this.createOpenPositionOrderRequest(
      symbol,
      quantity,
    )

    await this.submitOrder(orderRequest)
  }

  async closePosition(symbol: string): Promise<void> {
    const position: Position | null = await this.getPosition(symbol)
    if (!position) {
      throw Error('Tried to close a position when there is no open position!')
    }

    const orderRequest: OrderRequest =
      this.createClosePositionOrderRequest(position)

    await this.submitOrder(orderRequest)
  }

  abstract createOpenPositionOrderRequest(
    symbol: string,
    quantity: number,
  ): OrderRequest
  abstract createClosePositionOrderRequest(position: Position): OrderRequest

  private async submitOrder(orderRequest: OrderRequest): Promise<void> {
    const orderId: string = await this.apiService.submitOrder(orderRequest)
    const order: OrderCreate = await this.apiService.getOrder(
      orderRequest.symbol,
      orderId,
    )
    await this.orderService.store(order)
  }
}
