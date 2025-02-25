import { Side } from '../types/side'

export interface Trailing {
  symbol: string
  side: Side
  tp?: number
  sl?: number
  createdAt: Date
}

export type TrailingCreate = Omit<Trailing, 'createdAt'>
