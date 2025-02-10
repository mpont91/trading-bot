import { IndicatorCreate } from '../models/indicator'

export interface IndicatorRepository {
  create(indicator: IndicatorCreate): Promise<void>
}
