import { Side } from '../types/side'

export interface Order {
  id: number
  orderId: string
  symbol: string
  side: Side
  quantity: number
  price: number
  amount: number
  fees: number
  createdAt: Date
}

export interface OrderSpot extends Order {
  type: 'spot'
}

export interface OrderFutures extends Order {
  type: 'futures'
  contractSize: number
  leverage: number
}

export type OrderCreate = Omit<Order, 'id'>
export type OrderSpotCreate = Omit<OrderSpot, 'id'>
export type OrderFuturesCreate = Omit<OrderFutures, 'id'>

export interface OrderRequest {
  symbol: string
  side: Side
  quantity: number
}

export interface OrderSpotRequest extends OrderRequest {
  type: 'spot'
}

export interface OrderFuturesRequest extends OrderRequest {
  type: 'futures'
  leverage: number
  isClosePosition: boolean
}
