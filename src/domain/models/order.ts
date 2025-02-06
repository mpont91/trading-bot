import { Side } from '../types/side'

export interface Order {
  id: number
  orderId: string
  symbol: string
  side: Side
  quantity: number
  price: number
  fees: number
  createdAt: Date
}

export interface OrderSpot extends Order {
  type: 'spot'
}

export interface OrderFutures extends Order {
  type: 'futures'
  leverage: number
}

export type OrderCreate = Omit<Order, 'id'>
export type OrderSpotCreate = Omit<OrderSpot, 'id'>
export type OrderFuturesCreate = Omit<OrderFutures, 'id'>
