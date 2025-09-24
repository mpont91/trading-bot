import { Trade, TradeCreate } from '../models/trade'
import { TradeRepository } from '../repositories/trade-repository'
import { Order } from '../models/order'
import { Strategy } from '../models/strategy'
import { Position } from '../models/position'
import { TrailingService } from './trailing-service'
import { PositionService } from './position-service'
import { OrderService } from './order-service'

export class TradeService {
  constructor(
    private readonly maxOpenPosition: number,
    private readonly tradeRepository: TradeRepository,
    private readonly positionService: PositionService,
    private readonly orderService: OrderService,
    private readonly trailingService: TrailingService,
  ) {}

  async store(tradeCreate: TradeCreate): Promise<Trade> {
    return this.tradeRepository.create(tradeCreate)
  }

  async list(symbol?: string): Promise<Trade[]> {
    return this.tradeRepository.list(symbol)
  }

  async canOpenNewTrade(): Promise<boolean> {
    return (await this.positionService.list()).length < this.maxOpenPosition
  }

  async openTrade(strategy: Strategy): Promise<void> {
    await this.positionService.openPosition(strategy.symbol)

    if (
      !strategy.tp ||
      !strategy.sl ||
      !strategy.ts ||
      !strategy.tpPrice ||
      !strategy.slPrice
    ) {
      throw new Error('Strategy is not created correctly! Something is broken!')
    }

    await this.trailingService.store({
      symbol: strategy.symbol,
      tp: strategy.tp,
      sl: strategy.sl,
      ts: strategy.ts,
      tpPrice: strategy.tpPrice,
      slPrice: strategy.slPrice,
    })
  }

  async closeTrade(position: Position): Promise<void> {
    const entryOrder: Order | null = await this.orderService.get(
      position.entryOrderId,
    )

    if (!entryOrder) {
      throw new Error(
        'Closing a position when there is no entry order! Something is broken!',
      )
    }

    const exitOrder: Order = await this.positionService.closePosition(
      position.symbol,
    )

    await this.trailingService.remove(position.symbol)

    await this.store({
      symbol: entryOrder.symbol,
      quantity: entryOrder.quantity,
      entryOrderId: entryOrder.id,
      entryPrice: entryOrder.price,
      entryAt: entryOrder.createdAt,
      exitOrderId: exitOrder.id,
      exitPrice: exitOrder.price,
      exitAt: exitOrder.createdAt,
      fees: entryOrder.fees + exitOrder.fees,
      pnl: (exitOrder.price - entryOrder.price) * entryOrder.quantity,
    })
  }

  async handleTrade(position: Position): Promise<void> {
    if (await this.trailingService.shouldSell(position.symbol)) {
      await this.closeTrade(position)
    }
  }
}
