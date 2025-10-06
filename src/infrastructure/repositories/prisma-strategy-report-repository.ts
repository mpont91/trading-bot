import {
  StrategyReport as PrismaStrategyReport,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { StrategyReportRepository } from '../../domain/repositories/strategy-report-repository'
import {
  StrategyReport,
  StrategyReportCreate,
  strategyReportCreateSchema,
} from '../../domain/models/strategy-report'
import { z } from 'zod'

export class PrismaStrategyReportRepository
  implements StrategyReportRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(strategyReport: StrategyReportCreate): Promise<StrategyReport> {
    return this.toDomain(
      await this.prisma.strategyReport.create({
        data: this.toPrisma(strategyReport),
      }),
    )
  }

  private toDomain(prismaStrategyReport: PrismaStrategyReport): StrategyReport {
    const prismaReportSchema = z
      .object({
        id: z.number(),
        name: z.string(),
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
      .transform((data) => {
        return {
          id: data.id,
          name: data.name,
          symbol: data.symbol,
          price: data.price.toNumber(),
          conditions: data.conditions,
          shouldBuy: data.should_buy,
          shouldSell: data.should_sell,
          createdAt: data.created_at,
          tp: data.tp ? data.tp.toNumber() : null,
          sl: data.sl ? data.sl.toNumber() : null,
          ts: data.ts ? data.ts.toNumber() : null,
          tpPrice: data.tp_price ? data.tp_price.toNumber() : null,
          slPrice: data.sl_price ? data.sl_price.toNumber() : null,
        }
      })

    return prismaReportSchema.parse(prismaStrategyReport)
  }

  private toPrisma(
    strategyReport: StrategyReportCreate,
  ): Prisma.StrategyReportCreateInput {
    strategyReportCreateSchema.parse(strategyReport)

    return {
      name: strategyReport.name,
      symbol: strategyReport.symbol,
      price: strategyReport.price,
      tp: strategyReport.tp ? new Decimal(strategyReport.tp) : null,
      sl: strategyReport.sl ? new Decimal(strategyReport.sl) : null,
      ts: strategyReport.ts ? new Decimal(strategyReport.ts) : null,
      tp_price: strategyReport.tpPrice
        ? new Decimal(strategyReport.tpPrice)
        : null,
      sl_price: strategyReport.slPrice
        ? new Decimal(strategyReport.slPrice)
        : null,
      conditions: strategyReport.conditions,
      should_buy: strategyReport.shouldBuy,
      should_sell: strategyReport.shouldSell,
    }
  }
}
