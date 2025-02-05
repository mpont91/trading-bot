import { Side } from '../types/side'

export interface Order {
  id: number
  orderId: string
  symbol: string
  side: Side
  quantity: number
  leverage?: number
  price: number
  fees: number
  createdAt: Date
}

export interface OrderCreate {
  orderId: string
  symbol: string
  side: Side
  quantity: number
  leverage?: number
  price: number
  fees: number
  createdAt: Date
}
