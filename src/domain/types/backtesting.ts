export interface BacktestingSettings {
  initialEquity: number
  commissionRate: number
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
  signalHold: number
  signalBuy: number
  signalSell: number
  trendUp: number
  goldenCross: number
  strongTrend: number
  bullishDirection: number
  bullishMomentum: number
  notOverextended: number
  favorableEntryPrice: number
  deathCross: number
  bearishMomentum: number
  trendWeakening: number
  bearishConviction: number
}
