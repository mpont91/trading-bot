import { Side } from '../types/side'

export interface Trailing {
  symbol: string
  side: Side
  tp: number
  sl: number
  createdAt: Date
}

export interface TrailingCreate {
  symbol: string
  side: Side
  tp: number
  sl: number
}
