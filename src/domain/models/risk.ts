export interface Risk {
  id: number
  symbol: string
  price: number
  isTrendingUp: boolean
  isGoldenCross: boolean
  hasStrongTrend: boolean
  hasBullishDirection: boolean
  hasBullishMomentum: boolean
  notOverextended: boolean
  isDeathCross: boolean
  hasBearishMomentum: boolean
  trendIsWeakening: boolean
  sl?: number
  tp?: number
  ts?: number
  tpPrice?: number
  slPrice?: number
  shouldBuy: boolean
  shouldSell: boolean
  createdAt: Date
}

export type RiskCreate = Omit<Risk, 'id' | 'createdAt'>
