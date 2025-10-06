import { z } from 'zod/index'
import { Position as PrismaPosition, Prisma } from '@prisma/client'
import { Position } from '../../../domain/models/position'

export const prismaPositionSchema = z
  .object({
    symbol: z.string(),
    entry_order_id: z.number().int(),
    quantity: z.instanceof(Prisma.Decimal),
    price: z.instanceof(Prisma.Decimal),
    amount: z.instanceof(Prisma.Decimal),
    entry_at: z.date(),
  })
  .transform(
    (prismaPosition: PrismaPosition): Position => ({
      symbol: prismaPosition.symbol,
      entryOrderId: prismaPosition.entry_order_id,
      quantity: prismaPosition.quantity.toNumber(),
      price: prismaPosition.price.toNumber(),
      amount: prismaPosition.amount.toNumber(),
      entryAt: prismaPosition.entry_at,
    }),
  )
