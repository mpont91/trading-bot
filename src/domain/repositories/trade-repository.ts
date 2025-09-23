import { Trade, TradeCreate } from '../models/trade'
import { Performance } from '../types/performance'

export interface TradeRepository {
  create(tradeCreate: TradeCreate): Promise<Trade>
  list(symbol?: string): Promise<Trade[]>
  getPerformance(): Promise<Performance>
}
