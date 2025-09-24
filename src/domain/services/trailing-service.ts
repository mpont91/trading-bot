import { TrailingRepository } from '../repositories/trailing-repository'
import { Trailing, TrailingCreate } from '../models/trailing'
import { calculateSL, isSL, isTP } from '../helpers/stops-helper'
import { ApiService } from './api-service'

export class TrailingService {
  constructor(
    private readonly trailingRepository: TrailingRepository,
    private readonly apiService: ApiService,
  ) {}

  async store(trailing: TrailingCreate): Promise<Trailing> {
    return this.trailingRepository.create(trailing)
  }

  async get(symbol: string): Promise<Trailing | null> {
    return this.trailingRepository.get(symbol)
  }

  async remove(symbol: string): Promise<void> {
    await this.trailingRepository.remove(symbol)
  }

  updateTsPrice(symbol: string, tsPrice: number): Promise<Trailing> {
    return this.trailingRepository.updateTsPrice(symbol, tsPrice)
  }

  async list(): Promise<Trailing[]> {
    return this.trailingRepository.list()
  }

  async shouldSell(symbol: string): Promise<boolean> {
    const trailing: Trailing | null = await this.get(symbol)

    if (!trailing) {
      throw new Error(
        `No trailing when trying to handle an open position for ${symbol}`,
      )
    }

    const price: number = await this.apiService.getPrice(symbol)

    if (isSL(price, trailing.slPrice)) {
      return true
    }

    if (trailing.tsPrice && isSL(price, trailing.tsPrice)) {
      return true
    }

    if (!trailing.tsPrice && isTP(price, trailing.tpPrice)) {
      await this.updateTsPrice(trailing.symbol, calculateSL(price, trailing.ts))
      return false
    }

    if (
      trailing.tsPrice &&
      trailing.tsPrice <= calculateSL(price, trailing.ts)
    ) {
      await this.trailingRepository.updateTsPrice(
        symbol,
        calculateSL(price, trailing.ts),
      )
      return false
    }

    return false
  }
}
