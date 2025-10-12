import { z } from 'zod'
import { StrategyReport as PrismaStrategyReport, Prisma } from '@prisma/client'
import Decimal from 'decimal.js'
import {
  StrategyReport,
  StrategyReportCreate,
  strategyReportCreateSchema,
} from '../../../domain/models/strategy-report'
import { strategyConditionsSchema } from '../../../domain/types/strategy-conditions'

export const domainStrategyReportSchema = z
  .object({
    id: z.number(),
    symbol: z.string(),
    price: z.instanceof(Prisma.Decimal),
    conditions: z.any(),
    should_buy: z.boolean(),
    should_sell: z.boolean(),
    created_at: z.date(),
    tp: z.instanceof(Prisma.Decimal).nullable(),
    sl: z.instanceof(Prisma.Decimal).nullable(),
    ts: z.instanceof(Prisma.Decimal).nullable(),
    tp_price: z.instanceof(Prisma.Decimal).nullable(),
    sl_price: z.instanceof(Prisma.Decimal).nullable(),
  })
  .transform((prismaStrategyReport: PrismaStrategyReport): StrategyReport => {
    const prismaStrategyConditions = strategyConditionsSchema.parse(
      prismaStrategyReport.conditions,
    )

    return {
      id: prismaStrategyReport.id,
      symbol: prismaStrategyReport.symbol,
      price: prismaStrategyReport.price.toNumber(),
      conditions: prismaStrategyConditions,
      shouldBuy: prismaStrategyReport.should_buy,
      shouldSell: prismaStrategyReport.should_sell,
      createdAt: prismaStrategyReport.created_at,
      tp: prismaStrategyReport.tp ? prismaStrategyReport.tp.toNumber() : null,
      sl: prismaStrategyReport.sl ? prismaStrategyReport.sl.toNumber() : null,
      ts: prismaStrategyReport.ts ? prismaStrategyReport.ts.toNumber() : null,
      tpPrice: prismaStrategyReport.tp_price
        ? prismaStrategyReport.tp_price.toNumber()
        : null,
      slPrice: prismaStrategyReport.sl_price
        ? prismaStrategyReport.sl_price.toNumber()
        : null,
    }
  })

export const prismaStrategyReportSchema = strategyReportCreateSchema.transform(
  (strategyReportCreate: StrategyReportCreate) => {
    return {
      symbol: strategyReportCreate.symbol,
      price: strategyReportCreate.price,
      tp: strategyReportCreate.tp ? new Decimal(strategyReportCreate.tp) : null,
      sl: strategyReportCreate.sl ? new Decimal(strategyReportCreate.sl) : null,
      ts: strategyReportCreate.ts ? new Decimal(strategyReportCreate.ts) : null,
      tp_price: strategyReportCreate.tpPrice
        ? new Decimal(strategyReportCreate.tpPrice)
        : null,
      sl_price: strategyReportCreate.slPrice
        ? new Decimal(strategyReportCreate.slPrice)
        : null,
      conditions: strategyReportCreate.conditions,
      should_buy: strategyReportCreate.shouldBuy,
      should_sell: strategyReportCreate.shouldSell,
    }
  },
)
