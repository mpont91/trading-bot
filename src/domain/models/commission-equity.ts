export interface CommissionEquity {
  id: number
  currency: string
  quantity: number
  amount: number
  createdAt: Date
}

export type CommissionEquityCreate = Omit<CommissionEquity, 'id' | 'createdAt'>
