import { z } from 'zod/index'
import { Order as PrismaOrder, Prisma } from '@prisma/client'
import { sideSchema } from '../../../domain/types/side'
import { Order } from '../../../domain/models/order'

export const prismaOrderSchema = z
  .object({
    id: z.number().int(),
    order_id: z.string(),
    symbol: z.string(),
    side: sideSchema,
    quantity: z.instanceof(Prisma.Decimal),
    price: z.instanceof(Prisma.Decimal),
    amount: z.instanceof(Prisma.Decimal),
    fees: z.instanceof(Prisma.Decimal),
    created_at: z.date(),
  })
  .transform(
    (prismaOrder: PrismaOrder): Order => ({
      id: prismaOrder.id,
      orderId: prismaOrder.order_id,
      symbol: prismaOrder.symbol,
      side: prismaOrder.side,
      quantity: prismaOrder.quantity.toNumber(),
      price: prismaOrder.price.toNumber(),
      amount: prismaOrder.amount.toNumber(),
      fees: prismaOrder.fees.toNumber(),
      createdAt: prismaOrder.created_at,
    }),
  )
