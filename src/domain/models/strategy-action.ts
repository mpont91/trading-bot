import { signalSchema } from '../types/signal'
import { strategyStopsSchema } from '../types/strategy-stops'
import { z } from 'zod'

export const strategyActionSchema = z
  .object({
    id: z.number().int(),
    symbol: z.string(),
    price: z.number(),
    signal: signalSchema,
    createdAt: z.date(),
  })
  .extend(strategyStopsSchema.shape)

export const strategyActionCreateSchema = strategyActionSchema.omit({
  id: true,
  createdAt: true,
})

export type StrategyAction = z.infer<typeof strategyActionSchema>
export type StrategyActionCreate = z.infer<typeof strategyActionCreateSchema>
