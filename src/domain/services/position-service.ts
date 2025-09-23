import { Position } from '../models/position'
import { InvestmentService } from './investment-service'
import { Order } from '../models/order'
import { OrderService } from './order-service'
import { TradeService } from './trade-service'
import { PositionRepository } from '../repositories/position-repository'

export class PositionService {
  constructor(
    private readonly positionRepository: PositionRepository,
    private readonly investmentService: InvestmentService,
    private readonly orderService: OrderService,
    private readonly tradeService: TradeService,
  ) {}

  async store(position: Position): Promise<Position> {
    return this.positionRepository.create(position)
  }

  async get(symbol: string): Promise<Position | null> {
    return this.positionRepository.get(symbol)
  }

  async remove(symbol: string): Promise<void> {
    await this.positionRepository.remove(symbol)
  }

  async list(): Promise<Position[]> {
    return this.positionRepository.list()
  }

  async openPosition(symbol: string): Promise<Position> {
    const quantity: number =
      await this.investmentService.getInvestmentQuantity(symbol)

    const order: Order = await this.orderService.submitOrder({
      symbol,
      quantity,
      side: 'long',
    })

    return this.store({
      symbol,
      entryOrderId: order.id,
      quantity: order.quantity,
      price: order.price,
      amount: order.amount,
      entryAt: order.createdAt,
    })
  }

  async closePosition(symbol: string): Promise<void> {
    const position: Position | null = await this.get(symbol)
    if (!position) {
      throw new Error(
        `Tried to close a position when there is no open position! Symbol: ${symbol}`,
      )
    }

    const entryOrder: Order | null = await this.orderService.last(symbol)

    if (!entryOrder) {
      throw new Error(
        `There is no entry order. Something is broken! Symbol: ${symbol}`,
      )
    }

    const exitOrder: Order = await this.orderService.submitOrder({
      symbol: position.symbol,
      side: 'short',
      quantity: position.quantity,
    })

    await this.tradeService.storeTradeFromOrders(entryOrder, exitOrder)
    await this.remove(symbol)
  }
}
