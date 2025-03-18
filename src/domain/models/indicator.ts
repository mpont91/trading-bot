export interface IndicatorSMA {
  id: number
  period: number
  symbol: string
  price: number
  sma: number
  createdAt: Date
}

export type IndicatorSMACreate = Omit<IndicatorSMA, 'id' | 'createdAt'>

export interface IndicatorRSI {
  id: number
  period: number
  symbol: string
  price: number
  rsi: number
  createdAt: Date
}

export type IndicatorRSICreate = Omit<IndicatorRSI, 'id' | 'createdAt'>

export interface IndicatorATR {
  id: number
  period: number
  symbol: string
  price: number
  atr: number
  createdAt: Date
}

export type IndicatorATRCreate = Omit<IndicatorATR, 'id' | 'createdAt'>

export interface IndicatorADX {
  id: number
  period: number
  symbol: string
  price: number
  adx: number
  pdi: number
  mdi: number
  createdAt: Date
}

export type IndicatorADXCreate = Omit<IndicatorADX, 'id' | 'createdAt'>

export interface IndicatorBB {
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

export type IndicatorBBCreate = Omit<IndicatorBB, 'id' | 'createdAt'>

export interface IndicatorSMACross {
  id: number
  periodLong: number
  periodShort: number
  symbol: string
  price: number
  smaLong: number
  smaShort: number
  createdAt: Date
}

export type IndicatorSMACrossCreate = Omit<
  IndicatorSMACross,
  'id' | 'createdAt'
>
