import { Trade, TradeCreate } from '../models/trade'
import { TradeRepository } from '../repositories/trade-repository'
import { Order, OrderCreate } from '../models/order'
import { Performance } from '../types/performance'

export abstract class TradeService {
  constructor(private readonly tradeRepository: TradeRepository) {}

  async store(tradeCreate: TradeCreate): Promise<void> {
    await this.tradeRepository.create(tradeCreate)
  }

  async getLatest(): Promise<Trade[]> {
    return this.tradeRepository.getLatest()
  }

  async getPerformance(): Promise<Performance> {
    return this.tradeRepository.getPerformance()
  }

  abstract storeTradeFromOrders(
    entryOrder: Order,
    exitOrder: OrderCreate,
  ): Promise<void>
}
