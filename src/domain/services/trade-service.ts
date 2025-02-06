import { Trade, TradeCreate } from '../models/trade'
import { TradeRepository } from '../repositories/trade-repository'

export class TradeService {
  constructor(private readonly tradeRepository: TradeRepository) {}

  async store(tradeCreate: TradeCreate): Promise<void> {
    await this.tradeRepository.create(tradeCreate)
  }

  async getLatest(): Promise<Trade[]> {
    return await this.tradeRepository.getLatest()
  }
}
