import { Trade, TradeCreate } from '../models/trade'
import { TradeRepository } from '../repositories/trade-repository'
import { Order } from '../models/order'

export class TradeService {
  constructor(private readonly tradeRepository: TradeRepository) {}

  async store(tradeCreate: TradeCreate): Promise<Trade> {
    return this.tradeRepository.create(tradeCreate)
  }

  async list(symbol?: string): Promise<Trade[]> {
    return this.tradeRepository.list(symbol)
  }

  async storeTradeFromOrders(
    entryOrder: Order,
    exitOrder: Order,
  ): Promise<void> {
    const trade: TradeCreate = {
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
    }

    await this.store(trade)
  }
}
