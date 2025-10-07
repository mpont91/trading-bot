import { z } from 'zod'

export const symbolSchema = z.object({
  name: z.string(),
  price: z.number(),
  stepSize: z.number(),
})

export type Symbol = z.infer<typeof symbolSchema>
