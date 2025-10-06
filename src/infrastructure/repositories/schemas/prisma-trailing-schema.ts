import { z } from 'zod/index'
import { Trailing as PrismaTrailing, Prisma } from '@prisma/client'
import { Trailing } from '../../../domain/models/trailing'

export const prismaTrailingSchema = z
  .object({
    symbol: z.string(),
    tp: z.instanceof(Prisma.Decimal),
    sl: z.instanceof(Prisma.Decimal),
    ts: z.instanceof(Prisma.Decimal),
    tp_price: z.instanceof(Prisma.Decimal),
    sl_price: z.instanceof(Prisma.Decimal),
    ts_price: z.instanceof(Prisma.Decimal).nullable(),
    created_at: z.date(),
    updated_at: z.date(),
  })
  .transform(
    (prismaTrailing: PrismaTrailing): Trailing => ({
      symbol: prismaTrailing.symbol,
      tp: prismaTrailing.tp.toNumber(),
      sl: prismaTrailing.sl.toNumber(),
      ts: prismaTrailing.ts.toNumber(),
      tpPrice: prismaTrailing.tp_price.toNumber(),
      slPrice: prismaTrailing.sl_price.toNumber(),
      tsPrice: prismaTrailing.ts_price
        ? prismaTrailing.ts_price.toNumber()
        : undefined,
      createdAt: prismaTrailing.created_at,
      updatedAt: prismaTrailing.updated_at,
    }),
  )
