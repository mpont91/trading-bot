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

export type StrategyCreate = Omit<Strategy, 'id' | 'createdAt'>
