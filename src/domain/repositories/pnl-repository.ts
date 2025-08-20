import type { TimeInterval } from '../types/time-interval'
import { Pnl, PnlCreate } from '../models/pnl'

export interface PnlRepository {
  create(pnl: PnlCreate): Promise<void>
  get(interval: TimeInterval): Promise<Pnl[]>
}
