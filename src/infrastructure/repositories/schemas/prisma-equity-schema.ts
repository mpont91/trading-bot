import { z } from 'zod'
import { Equity as PrismaEquity, Prisma } from '@prisma/client'
import {
  Equity,
  EquityCreate,
  equityCreateSchema,
} from '../../../domain/models/equity'
import Decimal from 'decimal.js'

export const domainEquitySchema = z
  .object({
    id: z.number().int(),
    amount: z.instanceof(Prisma.Decimal),
    created_at: z.date(),
  })
  .transform(
    (prismaEquity: PrismaEquity): Equity => ({
      id: prismaEquity.id,
      amount: prismaEquity.amount.toNumber(),
      createdAt: prismaEquity.created_at,
    }),
  )

export const prismaEquitySchema = equityCreateSchema.transform(
  (equityCreate: EquityCreate) => {
    return {
      amount: new Decimal(equityCreate.amount),
    }
  },
)
