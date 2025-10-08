import { z } from 'zod'

export enum TimeFrame {
  '1m' = 1,
  '3m' = 3,
  '5m' = 5,
  '15m' = 15,
  '30m' = 30,
  '1h' = 60,
  '2h' = 120,
  '4h' = 240,
  '6h' = 360,
  '8h' = 480,
  '12h' = 720,
  '1d' = 1440,
  '3d' = 4320,
  '1w' = 10080,
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
