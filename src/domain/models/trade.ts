import { Side } from '../types/side'

export interface Trade {
  id: number
  symbol: string
  side: Side
  quantity: number
  entryOrderId: string
  entryPrice: number
  entryAt: Date
  exitOrderId: string
  exitPrice: number
  exitAt: Date
  fees: number
  pnl: number
}

export type TradeSpot = Trade

export interface TradeFutures extends Trade {
  contractSize: number
  leverage: number
}

export type TradeCreate = Omit<Trade, 'id'>
export type TradeSpotCreate = Omit<TradeSpot, 'id'>
export type TradeFuturesCreate = Omit<TradeFutures, 'id'>
