import { z } from 'zod/index'
import {
  CommissionEquity as PrismaCommissionEquity,
  Prisma,
} from '@prisma/client'
import { CommissionEquity } from '../../../domain/models/commission-equity'

export const prismaCommissionEquitySchema = z
  .object({
    id: z.number().int(),
    currency: z.string(),
    quantity: z.instanceof(Prisma.Decimal),
    amount: z.instanceof(Prisma.Decimal),
    created_at: z.date(),
  })
  .transform(
    (prismaCommissionEquity: PrismaCommissionEquity): CommissionEquity => ({
      id: prismaCommissionEquity.id,
      currency: prismaCommissionEquity.currency,
      quantity: prismaCommissionEquity.amount.toNumber(),
      amount: prismaCommissionEquity.amount.toNumber(),
      createdAt: prismaCommissionEquity.created_at,
    }),
  )
