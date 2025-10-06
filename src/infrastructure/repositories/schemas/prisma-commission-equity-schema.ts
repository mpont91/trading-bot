import { z } from 'zod'
import {
  CommissionEquity as PrismaCommissionEquity,
  Prisma,
} from '@prisma/client'
import {
  CommissionEquity,
  CommissionEquityCreate,
  commissionEquityCreateSchema,
} from '../../../domain/models/commission-equity'
import Decimal from 'decimal.js'

export const domainCommissionEquitySchema = z
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

export const prismaCommissionEquitySchema =
  commissionEquityCreateSchema.transform(
    (commissionEquityCreate: CommissionEquityCreate) => {
      return {
        currency: commissionEquityCreate.currency,
        quantity: new Decimal(commissionEquityCreate.quantity),
        amount: new Decimal(commissionEquityCreate.amount),
      }
    },
  )
