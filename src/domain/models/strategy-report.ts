import { strategyStopsSchema } from '../types/strategy-stops'
import { strategyConditionsSchema } from '../types/strategy-conditions'
import { z } from 'zod'

export const strategyReportSchema = z
  .object({
    id: z.number().int(),
    symbol: z.string(),
    price: z.number(),
    conditions: strategyConditionsSchema,
    shouldBuy: z.boolean(),
    shouldSell: z.boolean(),
    createdAt: z.date(),
  })
  .extend(strategyStopsSchema.shape)

export const strategyReportCreateSchema = strategyReportSchema.omit({
  id: true,
  createdAt: true,
})

export type StrategyReport = z.infer<typeof strategyReportSchema>
export type StrategyReportCreate = z.infer<typeof strategyReportCreateSchema>
