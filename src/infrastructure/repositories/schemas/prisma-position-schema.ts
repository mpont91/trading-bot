import { z } from 'zod'
import { Position as PrismaPosition, Prisma } from '@prisma/client'
import { Position, positionSchema } from '../../../domain/models/position'
import Decimal from 'decimal.js'

export const domainPositionSchema = z
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

export const prismaPositionSchema = positionSchema.transform(
  (position: Position) => {
    return {
      symbol: position.symbol,
      entry_order_id: position.entryOrderId,
      quantity: new Decimal(position.quantity),
      price: new Decimal(position.price),
      amount: new Decimal(position.amount),
      entry_at: position.entryAt,
    }
  },
)
