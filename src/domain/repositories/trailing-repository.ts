import { Trailing, TrailingCreate } from '../models/trailing'

export interface TrailingRepository {
  create(trailing: TrailingCreate): Promise<Trailing>
  get(symbol: string): Promise<Trailing | null>
  remove(symbol: string): Promise<void>
  updateTsPrice(symbol: string, tsPrice: number): Promise<Trailing>
  list(): Promise<Trailing[]>
}
