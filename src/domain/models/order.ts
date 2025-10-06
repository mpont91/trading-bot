import { sideSchema } from '../types/side'
import { z } from 'zod'

export const orderSchema = z.object({
  id: z.number().int(),
  orderId: z.string(),
  symbol: z.string(),
  side: sideSchema,
  quantity: z.number(),
  price: z.number(),
  amount: z.number(),
  fees: z.number(),
  createdAt: z.date(),
})

export const orderCreateSchema = orderSchema.omit({ id: true })

export const orderRequestSchema = z.object({
  symbol: z.string(),
  side: sideSchema,
  quantity: z.number(),
})

export type Order = z.infer<typeof orderSchema>
export type OrderCreate = z.infer<typeof orderCreateSchema>
export type OrderRequest = z.infer<typeof orderRequestSchema>
