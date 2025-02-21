import { Position } from '../types/position'
import { ApiService } from './api-service'
import { InvestmentService } from './investment-service'
import { Order, OrderCreate, OrderRequest } from '../models/order'
import { OrderService } from './order-service'
import { TradeService } from './trade-service'
import { Side } from '../types/side'
import { TrailingService } from './trailing-service'

export abstract class PositionService {
  constructor(
    private readonly apiService: ApiService,
    private readonly investmentService: InvestmentService,
    private readonly orderService: OrderService,
    private readonly tradeService: TradeService,
    private readonly trailingService: TrailingService,
  ) {}

  async getPosition(symbol: string): Promise<Position | null> {
    return this.apiService.getPosition(symbol)
  }

  async openPosition(symbol: string, side: Side = 'long'): Promise<void> {
    const quantity: number =
      await this.investmentService.getInvestmentQuantityFromSymbol(symbol)
    const orderRequest: OrderRequest = this.createOpenPositionOrderRequest(
      symbol,
      quantity,
      side,
    )

    await this.submitOrder(orderRequest)
  }

  async closePosition(symbol: string): Promise<void> {
    const position: Position | null = await this.getPosition(symbol)
    if (!position) {
      throw new Error(
        'Tried to close a position when there is no open position!',
      )
    }

    const orderRequest: OrderRequest =
      this.createClosePositionOrderRequest(position)

    const entryOrder: Order | null =
      await this.orderService.getLastOrderForSymbol(symbol)

    if (!entryOrder) {
      throw new Error('There is no entry order. Something is broken!')
    }

    const exitOrder: OrderCreate = await this.submitOrder(orderRequest)

    await this.tradeService.storeTradeFromOrders(entryOrder, exitOrder)
    await this.trailingService.remove(symbol)
  }

  abstract createOpenPositionOrderRequest(
    symbol: string,
    quantity: number,
    side: Side,
  ): OrderRequest
  abstract createClosePositionOrderRequest(position: Position): OrderRequest

  private async submitOrder(orderRequest: OrderRequest): Promise<OrderCreate> {
    const orderId: string = await this.apiService.submitOrder(orderRequest)
    const order: OrderCreate = await this.apiService.getOrder(
      orderRequest.symbol,
      orderId,
    )
    await this.orderService.store(order)

    return order
  }
}
