export interface Indicator {
  id: number
  name: string
  symbol: string
  period: number
  value: number
  createdAt: Date
}

export type IndicatorCreate = Omit<Indicator, 'id' | 'createdAt'>
