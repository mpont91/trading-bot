import { Side } from '../types/side'

export interface Strategy {
  id: number
  symbol: string
  price: number
  side: Side
  sl?: number
  tp?: number
  createdAt: Date
}

export type StrategySpot = Strategy

export interface StrategyFutures extends Strategy {
  leverage?: number
}

export type StrategyCreate = Omit<Strategy, 'id' | 'createdAt'>
export type StrategySpotCreate = Omit<StrategySpot, 'id' | 'createdAt'>
export type StrategyFuturesCreate = Omit<StrategyFutures, 'id' | 'createdAt'>
