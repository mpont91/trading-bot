import { Signal } from '../types/signal'
import { StrategyStops } from '../types/strategy-stops'

export interface StrategyAction extends StrategyStops {
  id: number
  symbol: string
  price: number
  signal: Signal
  createdAt: Date
}

export type StrategyActionCreate = Omit<StrategyAction, 'id' | 'createdAt'>
