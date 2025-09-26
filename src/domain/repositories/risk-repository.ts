import { Risk, RiskCreate } from '../models/risk'

export interface RiskRepository {
  create(risk: RiskCreate): Promise<Risk>
}
