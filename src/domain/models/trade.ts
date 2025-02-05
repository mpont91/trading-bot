import { Side } from '../types/side'

export interface Trade {
  id: number
  symbol: string
  side: Side
  quantity: number
  leverage?: number
  entryOrderId: string
  entryPrice: number
  entryAt: Date
  exitOrderId: string
  exitPrice: number
  exitAt: Date
  fees: number
  pnl: number
}

export interface TradeCreate {
  symbol: string
  side: Side
  quantity: number
  leverage?: number
  entryOrderId: string
  entryPrice: number
  entryAt: Date
  exitOrderId: string
  exitPrice: number
  exitAt: Date
  fees: number
  pnl: number
}
