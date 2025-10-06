import { z } from 'zod'

export const tradeSchema = z.object({
  id: z.number().int(),
  symbol: z.string(),
  quantity: z.number(),
  entryOrderId: z.number().int(),
  entryPrice: z.number(),
  entryAt: z.date(),
  exitOrderId: z.number().int(),
  exitPrice: z.number(),
  exitAt: z.date(),
  fees: z.number(),
  pnl: z.number(),
})

export const tradeCreateSchema = tradeSchema.omit({
  id: true,
})

export type Trade = z.infer<typeof tradeSchema>
export type TradeCreate = z.infer<typeof tradeCreateSchema>
