import { z } from 'zod'

export const trailingSchema = z.object({
  symbol: z.string(),
  tp: z.number(),
  sl: z.number(),
  ts: z.number(),
  tpPrice: z.number(),
  slPrice: z.number(),
  tsPrice: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const trailingCreateSchema = trailingSchema.omit({
  createdAt: true,
  updatedAt: true,
  tsPrice: true,
})

export type Trailing = z.infer<typeof trailingSchema>
export type TrailingCreate = z.infer<typeof trailingCreateSchema>
