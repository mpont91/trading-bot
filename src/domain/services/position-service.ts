import { Position } from '../types/position'
import { ApiService } from './api-service'
import { InvestmentService } from './investment-service'
import { Order, OrderCreate } from '../models/order'
import { OrderService } from './order-service'
import { TradeService } from './trade-service'
import { TrailingService } from './trailing-service'

export class PositionService {
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

  async openPosition(symbol: string): Promise<void> {
    const quantity: number =
      await this.investmentService.getInvestmentQuantity(symbol)

    await this.orderService.submitOrder({
      symbol,
      quantity,
      side: 'long',
    })
  }

  async closePosition(symbol: string): Promise<void> {
    const position: Position | null = await this.getPosition(symbol)
    if (!position) {
      throw new Error(
        `Tried to close a position when there is no open position! Symbol: ${symbol}`,
      )
    }

    const entryOrder: Order | null =
      await this.orderService.getLastOrderForSymbol(symbol)

    if (!entryOrder) {
      throw new Error(
        `There is no entry order. Something is broken! Symbol: ${symbol}`,
      )
    }

    const exitOrder: OrderCreate = await this.orderService.submitOrder({
      symbol: position.symbol,
      side: 'short',
      quantity: position.quantity,
    })

    await this.tradeService.storeTradeFromOrders(entryOrder, exitOrder)
    await this.trailingService.remove(symbol)
  }
}
