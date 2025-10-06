import { z } from 'zod'

export const positionSchema = z.object({
  symbol: z.string(),
  entryOrderId: z.number().int(),
  quantity: z.number(),
  price: z.number(),
  amount: z.number(),
  entryAt: z.date(),
})

export type Position = z.infer<typeof positionSchema>
