import { Trade, TradeCreate } from '../models/trade'
import { TradeRepository } from '../repositories/trade-repository'
import { Order, OrderCreate } from '../models/order'
import { Side } from '../types/side'

export class TradeService {
  constructor(private readonly tradeRepository: TradeRepository) {}

  async store(tradeCreate: TradeCreate): Promise<void> {
    await this.tradeRepository.create(tradeCreate)
  }

  async getLatest(): Promise<Trade[]> {
    return await this.tradeRepository.getLatest()
  }

  async storeTradeFromOrders(
    entryOrder: Order,
    exitOrder: OrderCreate,
  ): Promise<void> {
    const trade: TradeCreate = {
      symbol: entryOrder.symbol,
      side: entryOrder.side,
      quantity: entryOrder.quantity,
      entryOrderId: entryOrder.orderId,
      entryPrice: entryOrder.price,
      entryAt: entryOrder.createdAt,
      exitOrderId: exitOrder.orderId,
      exitPrice: exitOrder.price,
      exitAt: exitOrder.createdAt,
      fees: entryOrder.fees + exitOrder.fees,
      pnl: (exitOrder.price - entryOrder.price) * entryOrder.quantity,
    }

    await this.store(trade)
  }
}
