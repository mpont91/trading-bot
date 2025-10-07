import { z } from 'zod'
import { timeIntervalSchema } from '../../../domain/types/time-interval'
import { indicatorNameSchema } from '../../../domain/models/indicator'

export const getGraphIndicatorSchema = z.object({
  query: z.object({
    interval: timeIntervalSchema,
  }),
  params: z.object({
    symbol: z.string().transform((s) => s.toUpperCase()),
    indicator: indicatorNameSchema,
  }),
})
