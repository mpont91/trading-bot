import { Position } from '../models/position'
import { ApiService } from './api-service'
import { InvestmentService } from './investment-service'
import { Order, OrderCreate } from '../models/order'
import { OrderService } from './order-service'
import { TradeService } from './trade-service'
import { PositionRepository } from '../repositories/position-repository'

export class PositionService {
  constructor(
    private readonly positionRepository: PositionRepository,
    private readonly apiService: ApiService,
    private readonly investmentService: InvestmentService,
    private readonly orderService: OrderService,
    private readonly tradeService: TradeService,
  ) {}

  async store(position: Position): Promise<void> {
    await this.positionRepository.create(position)
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

  async check(symbol: string): Promise<boolean> {
    const real: Position | null = await this.apiService.getPosition(symbol)
    const stored: Position | null = await this.get(symbol)

    if (!real && !stored) {
      return true
    }

    if (!real && stored) {
      throw new Error(
        'There is not a position in the API but there is one stored into database. Something is broken.',
      )
    }

    if (real && !stored) {
      throw new Error(
        'There is a position in the API but there is not stored into database. Something is broken.',
      )
    }

    if (real?.quantity !== stored?.quantity) {
      throw new Error(
        'The quantity of the position in the API is different from the stored one. Something is broken.',
      )
    }

    return true
  }

  async openPosition(symbol: string): Promise<void> {
    const quantity: number =
      await this.investmentService.getInvestmentQuantity(symbol)

    await this.orderService.submitOrder({
      symbol,
      quantity,
      side: 'long',
    })

    const position: Position | null = await this.apiService.getPosition(symbol)
    if (!position) {
      throw new Error(
        `Opened a position but it does not exist! Symbol: ${symbol}`,
      )
    }

    await this.store(position)
  }

  async closePosition(symbol: string): Promise<void> {
    const position: Position | null = await this.get(symbol)
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
    await this.remove(symbol)
  }
}
