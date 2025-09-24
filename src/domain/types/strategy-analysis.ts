import type { Signal } from './signal'

export interface StrategyAnalysis {
  symbol: string
  prices: {
    amount: number
    date: Date
  }[]
  opportunities: {
    signal: Signal
    date: Date
  }[]
}
