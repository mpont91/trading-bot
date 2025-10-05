import { Stops } from './strategy-action'

export interface BuyConditions {
  trendUp: boolean
  goldenCross: boolean
  strongTrend: boolean
  bullishDirection: boolean
  bullishMomentum: boolean
  notOverextended: boolean
  favorableEntryPrice: boolean
}

export interface SellConditions {
  deathCross: boolean
  bearishMomentum: boolean
  trendWeakening: boolean
  bearishConviction: boolean
}

export interface StrategyReport extends Stops, BuyConditions, SellConditions {
  id: number
  symbol: string
  price: number
  shouldBuy: boolean
  shouldSell: boolean
  createdAt: Date
}

export type StrategyReportCreate = Omit<StrategyReport, 'id' | 'createdAt'>
