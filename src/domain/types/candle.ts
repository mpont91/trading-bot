import { z } from 'zod'

export enum TimeFrame {
  '1m' = 1,
  '3m' = 3,
  '5m' = 5,
  '15m' = 15,
  '30m' = 30,
  '60m' = 60,
  '120m' = 120,
  '240m' = 240,
}

export const timeFrameSchema = z.enum(TimeFrame)

export const candleSchema = z.object({
  time: z.date(),
  openPrice: z.number(),
  highPrice: z.number(),
  lowPrice: z.number(),
  closePrice: z.number(),
  volume: z.number(),
})

export type Candle = z.infer<typeof candleSchema>
