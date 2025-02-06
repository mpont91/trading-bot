import { Trade, TradeCreate } from '../models/trade'

export interface TradeRepository {
  create(tradeCreate: TradeCreate): Promise<void>
  getLatest(): Promise<Trade[]>
}
