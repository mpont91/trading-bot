import { Trailing, TrailingCreate } from '../models/trailing'

export interface TrailingRepository {
  create(trailing: TrailingCreate): Promise<void>
  get(symbol: string): Promise<Trailing | null>
  remove(symbol: string): Promise<void>
  list(): Promise<Trailing[]>
}
