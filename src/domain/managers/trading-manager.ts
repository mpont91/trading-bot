import { ManagerInterface } from './manager-interface'
import { StrategyService } from '../services/strategy-service'
import { PositionService } from '../services/position-service'
import { Strategy } from '../models/strategy'
import { Position } from '../models/position'
import { TrailingService } from '../services/trailing-service'
import { Trailing, TrailingCreate } from '../models/trailing'
import { isSL, isTP } from '../helpers/stops-helper'
import { Order } from '../models/order'
import { OrderService } from '../services/order-service'
import { TradeService } from '../services/trade-service'

export class TradingManager implements ManagerInterface {
  constructor(
    private readonly symbols: string[],
    private readonly positionService: PositionService,
    private readonly strategyService: StrategyService,
    private readonly trailingService: TrailingService,
    private readonly orderService: OrderService,
    private readonly tradeService: TradeService,
  ) {}

  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      const strategy: Strategy | null = await this.strategyService.last(symbol)
      if (!strategy || strategy.side === 'hold') {
        continue
      }

      const position: Position | null = await this.positionService.get(symbol)

      if (!position) {
        if (strategy.side === 'long') {
          await this.handleOpportunity(strategy)
        }
        continue
      }

      if (strategy.side === 'short') {
        const entryOrder: Order | null = await this.orderService.get(
          position.entryOrderId,
        )

        if (!entryOrder) {
          throw new Error(
            'Closing a position when there is no entry order! Something is broken!',
          )
        }

        const exitOrder: Order =
          await this.positionService.closePosition(symbol)
        await this.trailingService.remove(symbol)
        await this.tradeService.storeTradeFromOrders(entryOrder, exitOrder)
      }

      await this.handlePosition(position, strategy.price)
    }
  }

  async handlePosition(position: Position, price: number): Promise<void> {
    const trailing: Trailing | null = await this.trailingService.get(
      position.symbol,
    )

    if (
      !trailing ||
      isTP('long', price, trailing.tp) ||
      isSL('long', price, trailing.sl)
    ) {
      await this.positionService.closePosition(position.symbol)
      await this.trailingService.remove(position.symbol)
      return
    }
  }
  async handleOpportunity(strategy: Strategy): Promise<void> {
    await this.positionService.openPosition(strategy.symbol)
    const trailing: TrailingCreate = {
      symbol: strategy.symbol,
      tp: strategy.tp!,
      sl: strategy.sl!,
    }
    await this.trailingService.store(trailing)
  }
}
