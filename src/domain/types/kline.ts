export const klineIntervalOptions = [
  1, 3, 5, 15, 30, 60, 120, 240, 360, 720, 1440, 4320, 10080,
] as const

export type KlineInterval = (typeof klineIntervalOptions)[number]

export interface Kline {
  time: Date
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  volume: number
}
