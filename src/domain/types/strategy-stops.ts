import { z } from 'zod'

export const strategyStopsSchema = z.object({
  sl: z.number().nullable(),
  tp: z.number().nullable(),
  ts: z.number().nullable(),
  tpPrice: z.number().nullable(),
  slPrice: z.number().nullable(),
})

export type StrategyStops = z.infer<typeof strategyStopsSchema>
