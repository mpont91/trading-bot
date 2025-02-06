export interface Equity {
  id: number
  amount: number
  createdAt: Date
}

export type EquityCreate = Omit<Equity, 'id' | 'createdAt'>
