import { TimeInterval } from '../types/time-interval'
import { Equity } from '../models/equity'

export interface EquityServiceInterface {
  graph(interval: TimeInterval): Promise<Equity[]>
}
