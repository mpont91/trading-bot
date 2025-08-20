export interface Pnl {
  id: number
  amount: number
  createdAt: Date
}

export type PnlCreate = Omit<Pnl, 'id' | 'createdAt'>
