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

export type OrderSpot = Order

export interface OrderFutures extends Order {
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

export type OrderSpotRequest = OrderRequest

export interface OrderFuturesRequest extends OrderRequest {
  leverage: number
  isClosePosition: boolean
}
