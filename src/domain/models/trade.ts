export interface Trade {
  id: number
  symbol: string
  quantity: number
  entryOrderId: number
  entryPrice: number
  entryAt: Date
  exitOrderId: number
  exitPrice: number
  exitAt: Date
  fees: number
  pnl: number
}

export type TradeCreate = Omit<Trade, 'id'>
