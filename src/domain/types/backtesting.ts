export interface BacktestingPosition {
  entryPrice: number
  amount: number
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
}
