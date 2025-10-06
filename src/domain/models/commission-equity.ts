import { z } from 'zod'

export const commissionEquitySchema = z.object({
  id: z.number().int(),
  currency: z.string(),
  quantity: z.number(),
  amount: z.number(),
  createdAt: z.date(),
})

export const commissionEquityCreateSchema = commissionEquitySchema.omit({
  id: true,
  createdAt: true,
})

export type CommissionEquity = z.infer<typeof commissionEquitySchema>
export type CommissionEquityCreate = z.infer<
  typeof commissionEquityCreateSchema
>
