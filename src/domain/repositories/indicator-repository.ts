import { BbIndicatorModelCreate } from '../models/indicator'

export interface IndicatorRepository {
  createBB(indicator: BbIndicatorModelCreate): Promise<void>
}
