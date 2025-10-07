import { z } from 'zod'
import { timeIntervalSchema } from '../../../domain/types/time-interval'

export const getLastStrategiesSchema = z.object({
  params: z.object({
    symbol: z
      .string()
      .optional()
      .transform((s) => s?.toUpperCase()),
  }),
})

export const getLastOpportunitiesSchema = z.object({
  params: z.object({
    symbol: z
      .string()
      .optional()
      .transform((s) => s?.toUpperCase()),
  }),
})

export const getStrategyAnalysisSchema = z.object({
  query: z.object({
    interval: timeIntervalSchema,
  }),
  params: z.object({
    symbol: z.string().transform((s) => s.toUpperCase()),
  }),
})
