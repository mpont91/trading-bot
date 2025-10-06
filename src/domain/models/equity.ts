import { z } from 'zod'

export const equitySchema = z.object({
  id: z.number().int(),
  amount: z.number(),
  createdAt: z.date(),
})

export const equityCreateSchema = equitySchema.omit({
  id: true,
  createdAt: true,
})

export type Equity = z.infer<typeof equitySchema>
export type EquityCreate = z.infer<typeof equityCreateSchema>
