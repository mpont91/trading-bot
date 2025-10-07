import { z } from 'zod'
import { StrategyAction as PrismaStrategyAction, Prisma } from '@prisma/client'
import Decimal from 'decimal.js'
import { signalSchema } from '../../../domain/types/signal'
import {
  StrategyAction,
  StrategyActionCreate,
  strategyActionCreateSchema,
} from '../../../domain/models/strategy-action'

export const domainStrategyActionSchema = z
  .object({
    id: z.number().int(),
    symbol: z.string(),
    price: z.instanceof(Prisma.Decimal),
    signal: signalSchema,
    tp: z.instanceof(Prisma.Decimal).nullable(),
    sl: z.instanceof(Prisma.Decimal).nullable(),
    ts: z.instanceof(Prisma.Decimal).nullable(),
    tp_price: z.instanceof(Prisma.Decimal).nullable(),
    sl_price: z.instanceof(Prisma.Decimal).nullable(),
    created_at: z.date(),
  })
  .transform(
    (prismaStrategyAction: PrismaStrategyAction): StrategyAction => ({
      id: prismaStrategyAction.id,
      symbol: prismaStrategyAction.symbol,
      price: prismaStrategyAction.price.toNumber(),
      signal: prismaStrategyAction.signal,
      tp: prismaStrategyAction.tp ? prismaStrategyAction.tp.toNumber() : null,
      sl: prismaStrategyAction.sl ? prismaStrategyAction.sl.toNumber() : null,
      ts: prismaStrategyAction.ts ? prismaStrategyAction.ts.toNumber() : null,
      tpPrice: prismaStrategyAction.tp_price
        ? prismaStrategyAction.tp_price.toNumber()
        : null,
      slPrice: prismaStrategyAction.sl_price
        ? prismaStrategyAction.sl_price.toNumber()
        : null,
      createdAt: prismaStrategyAction.created_at,
    }),
  )

export const prismaStrategyActionSchema = strategyActionCreateSchema.transform(
  (strategyActionCreate: StrategyActionCreate) => {
    return {
      symbol: strategyActionCreate.symbol,
      price: new Decimal(strategyActionCreate.price),
      signal: strategyActionCreate.signal,
      tp: strategyActionCreate.tp
        ? new Decimal(strategyActionCreate.tp)
        : undefined,
      sl: strategyActionCreate.sl
        ? new Decimal(strategyActionCreate.sl)
        : undefined,
      ts: strategyActionCreate.ts
        ? new Decimal(strategyActionCreate.ts)
        : undefined,
      tp_price: strategyActionCreate.tpPrice
        ? new Decimal(strategyActionCreate.tpPrice)
        : undefined,
      sl_price: strategyActionCreate.slPrice
        ? new Decimal(strategyActionCreate.slPrice)
        : undefined,
    }
  },
)
