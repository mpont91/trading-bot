export interface Trade {
  id: number
  symbol: string
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

export type TradeCreate = Omit<Trade, 'id'>
