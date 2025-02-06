import { Side } from './side'

export interface Position {
  symbol: string
  side: Side
  quantity: number
  price: number
  entryAt: Date
}

export interface PositionSpot extends Position {
  type: 'spot'
}

export interface PositionFutures extends Position {
  type: 'futures'
  leverage: number
}

export interface PositionRequest {
  symbol: string
}

export interface PositionRequestSpot extends PositionRequest {
  type: 'spot'
}

export interface PositionRequestFutures extends PositionRequest {
  type: 'futures'
  side: Side
  leverage: number
}
