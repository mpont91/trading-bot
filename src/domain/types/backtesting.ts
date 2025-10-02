export interface BacktestingSettings {
  initialEquity: number
  commissionRate: number
  historyLimit: number
  safetyCapitalMargin: number
  maxPositionsOpened: number
}
export interface BacktestingPosition {
  entryPrice: number
  quantity: number
  tpPrice: number
  slPrice: number
  ts: number
  tsPrice: number | null
}

export interface BacktestingSummary {
  initialEquity: number
  finalEquity: number
  fees: number
  trades: number
  success: number
  failed: number
  sell: number
  sl: number
  ts: number
  pnl: number
  net: number
}
