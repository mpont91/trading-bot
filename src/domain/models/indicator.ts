export interface Indicator {
  id: number
  name: string
  symbol: string
  period: number
  value: number
  price: number
  createdAt: Date
}

export type IndicatorCreate = Omit<Indicator, 'id' | 'createdAt'>
