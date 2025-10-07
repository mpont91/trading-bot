import { z } from 'zod'
import { timeIntervalSchema } from '../../../domain/types/time-interval'

export const getEquityGraphSchema = z.object({
  query: z.object({
    interval: timeIntervalSchema,
  }),
})
