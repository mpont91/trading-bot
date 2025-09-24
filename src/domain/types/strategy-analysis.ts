import type { Side } from './side'

export interface StrategyAnalysis {
  symbol: string
  prices: {
    amount: number
    date: Date
  }[]
  opportunities: {
    side: Side
    date: Date
  }[]
}
