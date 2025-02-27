import { Trade, TradeCreate } from '../models/trade'
import { Performance } from '../types/performance'

export interface TradeRepository {
  create(tradeCreate: TradeCreate): Promise<void>
  getLatest(): Promise<Trade[]>
  getPerformance(): Promise<Performance>
}
