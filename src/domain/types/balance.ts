import { z } from 'zod'

export const balanceSchema = z.object({
  equity: z.number(),
  available: z.number(),
})

export type Balance = z.infer<typeof balanceSchema>
