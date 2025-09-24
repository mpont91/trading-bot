import { Signal } from '../types/signal'

export interface Strategy {
  id: number
  symbol: string
  price: number
  signal: Signal
  sl?: number
  tp?: number
  createdAt: Date
}

export type StrategyCreate = Omit<Strategy, 'id' | 'createdAt'>
