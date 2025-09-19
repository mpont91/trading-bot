export interface Trailing {
  symbol: string
  tp: number
  sl: number
  createdAt: Date
}

export type TrailingCreate = Omit<Trailing, 'createdAt'>
