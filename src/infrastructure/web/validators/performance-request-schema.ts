import { z } from 'zod'

export const getPerformanceSchema = z.object({
  params: z.object({
    symbol: z
      .string()
      .optional()
      .transform((s) => s?.toUpperCase()),
  }),
})
