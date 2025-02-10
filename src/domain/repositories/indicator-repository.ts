import { IndicatorCreate } from '../models/indicator'

export interface IndicatorRepository {
  createMany(indicators: IndicatorCreate[]): Promise<void>
}
