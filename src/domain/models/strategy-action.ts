import { Signal } from '../types/signal'

export interface Stops {
  sl?: number
  tp?: number
  ts?: number
  tpPrice?: number
  slPrice?: number
}

export interface StrategyAction extends Stops {
  id: number
  symbol: string
  price: number
  signal: Signal
  createdAt: Date
}

export type StrategyActionCreate = Omit<StrategyAction, 'id' | 'createdAt'>
