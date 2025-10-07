import { signalSchema } from './signal'
import { z } from 'zod'

export const strategyAnalysisSchema = z.object({
  symbol: z.string(),
  prices: z.array(
    z.object({
      amount: z.number(),
      date: z.date(),
    }),
  ),
  opportunities: z.array(
    z.object({
      signal: signalSchema,
      date: z.date(),
    }),
  ),
})

export type StrategyAnalysis = z.infer<typeof strategyAnalysisSchema>
