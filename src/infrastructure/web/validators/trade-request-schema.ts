import { z } from 'zod'

export const getLastTradesSchema = z.object({
  params: z.object({
    symbol: z
      .string()
      .optional()
      .transform((s) => s?.toUpperCase()),
  }),
})
