import { z } from 'zod'

export const timeFrameOptions = [
  1, 3, 5, 15, 30, 60, 120, 240, 360, 720, 1440, 4320, 10080,
] as const

const literalSchemas = timeFrameOptions.map((value) => z.literal(value))
const [first, ...rest] = literalSchemas

export const timeFrameSchema = z.union([first, ...rest])

export type TimeFrame = z.infer<typeof timeFrameSchema>

export const candleSchema = z.object({
  time: z.date(),
  openPrice: z.number(),
  highPrice: z.number(),
  lowPrice: z.number(),
  closePrice: z.number(),
  volume: z.number(),
})

export type Candle = z.infer<typeof candleSchema>
