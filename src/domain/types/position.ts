import { Side } from './side'

export interface Position {
  symbol: string
  side: Side
  quantity: number
  price: number
  entryAt: Date
}

export type PositionSpot = Position

export interface PositionFutures extends Position {
  leverage: number
}
