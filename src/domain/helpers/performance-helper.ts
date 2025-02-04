import { Performance } from '../types/performance'

export function getEmptyPerformance(): Performance {
  return {
    trades: 0,
    success: 0,
    failed: 0,
    pnl: 0,
    fees: 0,
    net: 0,
  }
}
