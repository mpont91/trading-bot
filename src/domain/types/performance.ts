import { z } from 'zod'

export const performanceSchema = z.object({
  trades: z.number().int(),
  success: z.number().int(),
  failed: z.number().int(),
  pnl: z.number(),
  fees: z.number(),
  net: z.number(),
})

export type Performance = z.infer<typeof performanceSchema>
