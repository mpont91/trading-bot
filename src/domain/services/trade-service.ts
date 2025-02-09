import { Trade, TradeCreate } from '../models/trade'
import { TradeRepository } from '../repositories/trade-repository'
import { Order, OrderCreate } from '../models/order'

export abstract class TradeService {
  constructor(private readonly tradeRepository: TradeRepository) {}

  async store(tradeCreate: TradeCreate): Promise<void> {
    await this.tradeRepository.create(tradeCreate)
  }

  async getLatest(): Promise<Trade[]> {
    return await this.tradeRepository.getLatest()
  }

  abstract storeTradeFromOrders(
    entryOrder: Order,
    exitOrder: OrderCreate,
  ): Promise<void>
}
