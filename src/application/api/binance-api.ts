import { Api } from './api'
import { CommissionEquityCreate } from '../../domain/models/commission-equity'

export interface BinanceApi extends Api {
  getCommissionEquity(): Promise<CommissionEquityCreate>
}
