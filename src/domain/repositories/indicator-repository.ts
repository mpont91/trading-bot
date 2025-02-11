import { Indicator, IndicatorCreate } from '../models/indicator'

export interface IndicatorRepository {
  createMany(indicators: IndicatorCreate[]): Promise<void>
  getLatest(): Promise<Indicator[]>
}
