import { z } from 'zod'
import { Order as PrismaOrder, Prisma } from '@prisma/client'
import { sideSchema } from '../../../domain/types/side'
import {
  Order,
  OrderCreate,
  orderCreateSchema,
} from '../../../domain/models/order'
import Decimal from 'decimal.js'

export const domainOrderSchema = z
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

export const prismaOrderSchema = orderCreateSchema.transform(
  (orderCreate: OrderCreate) => {
    return {
      order_id: orderCreate.orderId,
      symbol: orderCreate.symbol,
      side: orderCreate.side,
      quantity: new Decimal(orderCreate.quantity),
      price: new Decimal(orderCreate.price),
      amount: new Decimal(orderCreate.amount),
      fees: new Decimal(orderCreate.fees),
      created_at: orderCreate.createdAt,
    }
  },
)
