import { Side } from './side'

export interface Position {
  symbol: string
  side: Side
  quantity: number
  price: number
  amount: number
  entryAt: Date
}

export type PositionSpot = Position
