import {
  CommissionEquity,
  CommissionEquityCreate,
} from '../models/commission-equity'
import { settings } from '../../application/settings'

export function getEmptyCommissionEquity(): CommissionEquity {
  return {
    id: -1,
    currency: settings.binance.feeCurrency,
    quantity: 0,
    amount: 0,
    createdAt: new Date(),
  }
}

export function getEmptyCommissionEquityCreate(): CommissionEquityCreate {
  return {
    currency: settings.binance.feeCurrency,
    quantity: 0,
    amount: 0,
  }
}
