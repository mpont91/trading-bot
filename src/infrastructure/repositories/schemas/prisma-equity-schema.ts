import { z } from 'zod/index'
import { Equity as PrismaEquity, Prisma } from '@prisma/client'
import { Equity } from '../../../domain/models/equity'

export const prismaEquitySchema = z
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
