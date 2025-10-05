export const timeFrameOptions = [
  1, 3, 5, 15, 30, 60, 120, 240, 360, 720, 1440, 4320, 10080,
] as const

export type TimeFrame = (typeof timeFrameOptions)[number]

export interface Candle {
  time: Date
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  volume: number
}
