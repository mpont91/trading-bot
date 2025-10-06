import { z } from 'zod'
import { Trade as PrismaTrade, Prisma } from '@prisma/client'
import {
  Trade,
  TradeCreate,
  tradeCreateSchema,
} from '../../../domain/models/trade'
import Decimal from 'decimal.js'

export const domainTradeSchema = z
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

export const prismaTradeSchema = tradeCreateSchema.transform(
  (tradeCreate: TradeCreate) => {
    return {
      symbol: tradeCreate.symbol,
      quantity: new Decimal(tradeCreate.quantity),
      entry_order_id: tradeCreate.entryOrderId,
      entry_price: new Decimal(tradeCreate.entryPrice),
      entry_at: tradeCreate.entryAt,
      exit_order_id: tradeCreate.exitOrderId,
      exit_price: new Decimal(tradeCreate.exitPrice),
      exit_at: tradeCreate.exitAt,
      fees: new Decimal(tradeCreate.fees),
      pnl: new Decimal(tradeCreate.pnl),
    }
  },
)
