import { Stops } from './strategy'

export interface BuyConditions {
  trendUp: boolean
  goldenCross: boolean
  strongTrend: boolean
  bullishDirection: boolean
  bullishMomentum: boolean
  notOverextended: boolean
}

export interface SellConditions {
  deathCross: boolean
  bearishMomentum: boolean
  trendWeakening: boolean
}

export interface Risk extends Stops, BuyConditions, SellConditions {
  id: number
  symbol: string
  price: number
  validStops?: boolean
  riskReward?: boolean
  shouldBuy: boolean
  shouldSell: boolean
  createdAt: Date
}

export type RiskCreate = Omit<Risk, 'id' | 'createdAt'>
