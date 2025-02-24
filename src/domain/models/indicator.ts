export interface AdxIndicatorType {
  adx: number
  pdi: number
  mdi: number
}

export interface BbIndicatorType {
  middle: number
  upper: number
  lower: number
  pb: number
}

export interface BbIndicatorModel {
  id: number
  period: number
  symbol: string
  price: number
  upper: number
  middle: number
  lower: number
  pb: number
  createdAt: Date
}

export type BbIndicatorModelCreate = Omit<BbIndicatorModel, 'id' | 'createdAt'>
