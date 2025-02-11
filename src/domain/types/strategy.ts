import { Side } from './side'

export type HOLD = 'HOLD'

export interface Strategy {
  symbol: string
  side: Side
  sl: number
  tp: number
  leverage: number
  price: number
}
