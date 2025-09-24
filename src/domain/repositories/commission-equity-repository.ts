import {
  CommissionEquity,
  CommissionEquityCreate,
} from '../models/commission-equity'

export interface CommissionEquityRepository {
  create(commissionEquity: CommissionEquityCreate): Promise<CommissionEquity>
  get(): Promise<CommissionEquity | null>
}
