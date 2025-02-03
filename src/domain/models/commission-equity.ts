export interface CommissionEquity {
  id: number
  currency: string
  quantity: number
  amount: number
  createdAt: Date
}

export interface CommissionEquityCreate {
  currency: string
  quantity: number
  amount: number
}
