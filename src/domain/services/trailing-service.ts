import { TrailingRepository } from '../repositories/trailing-repository'
import { Trailing, TrailingCreate } from '../models/trailing'

export class TrailingService {
  constructor(private readonly trailingRepository: TrailingRepository) {}

  async store(trailing: TrailingCreate): Promise<Trailing> {
    return this.trailingRepository.create(trailing)
  }

  async get(symbol: string): Promise<Trailing | null> {
    return this.trailingRepository.get(symbol)
  }

  async remove(symbol: string): Promise<void> {
    await this.trailingRepository.remove(symbol)
  }

  async list(): Promise<Trailing[]> {
    return this.trailingRepository.list()
  }
}
