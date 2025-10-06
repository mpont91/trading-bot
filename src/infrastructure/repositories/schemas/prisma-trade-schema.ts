import { z } from 'zod/index'
import { Trade as PrismaTrade, Prisma } from '@prisma/client'
import { Trade } from '../../../domain/models/trade'

export const prismaTradeSchema = z
  .object({
    id: z.number().int(),
    symbol: z.string(),
    quantity: z.instanceof(Prisma.Decimal),
    entry_order_id: z.number().int(),
    entry_price: z.instanceof(Prisma.Decimal),
    entry_at: z.date(),
    exit_order_id: z.number().int(),
    exit_price: z.instanceof(Prisma.Decimal),
    exit_at: z.date(),
    fees: z.instanceof(Prisma.Decimal),
    pnl: z.instanceof(Prisma.Decimal),
  })
  .transform(
    (prismaTrade: PrismaTrade): Trade => ({
      id: prismaTrade.id,
      symbol: prismaTrade.symbol,
      quantity: prismaTrade.quantity.toNumber(),
      entryOrderId: prismaTrade.entry_order_id,
      entryPrice: prismaTrade.entry_price.toNumber(),
      entryAt: prismaTrade.entry_at,
      exitOrderId: prismaTrade.exit_order_id,
      exitPrice: prismaTrade.exit_price.toNumber(),
      exitAt: prismaTrade.exit_at,
      fees: prismaTrade.fees.toNumber(),
      pnl: prismaTrade.pnl.toNumber(),
    }),
  )
