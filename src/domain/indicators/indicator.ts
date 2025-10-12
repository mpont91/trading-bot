import { Candle } from '../types/candle'
import { z } from 'zod'

export const indicatorResultSchema = z.object({
  symbol: z.string(),
  price: z.number(),
})

export type IndicatorResult = z.infer<typeof indicatorResultSchema>

export interface Indicator {
  calculate(symbol: string, candles: Candle[]): IndicatorResult
}
