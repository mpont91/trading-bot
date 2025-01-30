import { Equity, EquityCreate } from '../models/equity'
import type { TimeInterval } from '../types/time-interval'

export interface EquityRepository {
  create(equity: EquityCreate): Promise<void>
  get(interval: TimeInterval): Promise<Equity[]>
}
