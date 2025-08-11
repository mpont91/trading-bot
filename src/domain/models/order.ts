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

export type OrderCreate = Omit<Order, 'id'>

export interface OrderRequest {
  symbol: string
  side: Side
  quantity: number
}
