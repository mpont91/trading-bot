import {
  CommissionEquity,
  CommissionEquityCreate,
} from '../models/commission-equity'

export interface CommissionEquityRepository {
  create(commissionEquity: CommissionEquityCreate): Promise<void>
  get(): Promise<CommissionEquity>
}
