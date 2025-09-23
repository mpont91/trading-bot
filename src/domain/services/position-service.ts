import { Position } from '../models/position'
import { InvestmentService } from './investment-service'
import { Order } from '../models/order'
import { OrderService } from './order-service'
import { PositionRepository } from '../repositories/position-repository'

export class PositionService {
  constructor(
    private readonly positionRepository: PositionRepository,
    private readonly investmentService: InvestmentService,
    private readonly orderService: OrderService,
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

  async openPosition(symbol: string): Promise<Order> {
    const quantity: number =
      await this.investmentService.getInvestmentQuantity(symbol)

    const entryOrder: Order = await this.orderService.submitOrder({
      symbol,
      quantity,
      side: 'long',
    })

    await this.store({
      symbol,
      entryOrderId: entryOrder.id,
      quantity: entryOrder.quantity,
      price: entryOrder.price,
      amount: entryOrder.amount,
      entryAt: entryOrder.createdAt,
    })

    return entryOrder
  }

  async closePosition(symbol: string): Promise<Order> {
    const position: Position | null = await this.get(symbol)

    if (!position) {
      throw new Error(
        `Tried to close a position when there is no open position! Symbol: ${symbol}`,
      )
    }

    const exitOrder: Order = await this.orderService.submitOrder({
      symbol: position.symbol,
      side: 'short',
      quantity: position.quantity,
    })

    await this.remove(symbol)

    return exitOrder
  }
}
