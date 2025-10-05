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
} from '../../domain/models/strategy-report'

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
    return {
      id: prismaStrategyReport.id,
      symbol: prismaStrategyReport.symbol,
      price: prismaStrategyReport.price.toNumber(),
      trendUp: prismaStrategyReport.trend_up,
      goldenCross: prismaStrategyReport.golden_cross,
      strongTrend: prismaStrategyReport.strong_trend,
      bullishDirection: prismaStrategyReport.bullish_direction,
      bullishMomentum: prismaStrategyReport.bullish_momentum,
      notOverextended: prismaStrategyReport.not_overextended,
      favorableEntryPrice: prismaStrategyReport.favorable_entry_price,
      deathCross: prismaStrategyReport.death_cross,
      bearishMomentum: prismaStrategyReport.bearish_momentum,
      bearishConviction: prismaStrategyReport.bearish_conviction,
      trendWeakening: prismaStrategyReport.trend_weakening,
      tp: prismaStrategyReport.tp
        ? prismaStrategyReport.tp.toNumber()
        : undefined,
      sl: prismaStrategyReport.sl
        ? prismaStrategyReport.sl.toNumber()
        : undefined,
      ts: prismaStrategyReport.ts
        ? prismaStrategyReport.ts.toNumber()
        : undefined,
      tpPrice: prismaStrategyReport.tp_price
        ? prismaStrategyReport.tp_price.toNumber()
        : undefined,
      slPrice: prismaStrategyReport.sl_price
        ? prismaStrategyReport.sl_price.toNumber()
        : undefined,
      shouldBuy: prismaStrategyReport.should_buy,
      shouldSell: prismaStrategyReport.should_sell,
      createdAt: prismaStrategyReport.created_at,
    }
  }

  private toPrisma(
    strategyReport: StrategyReportCreate,
  ): Prisma.StrategyReportCreateInput {
    return {
      symbol: strategyReport.symbol,
      price: strategyReport.price,
      trend_up: strategyReport.trendUp,
      golden_cross: strategyReport.goldenCross,
      strong_trend: strategyReport.strongTrend,
      bullish_direction: strategyReport.bullishDirection,
      bullish_momentum: strategyReport.bullishMomentum,
      not_overextended: strategyReport.notOverextended,
      favorable_entry_price: strategyReport.favorableEntryPrice,
      death_cross: strategyReport.deathCross,
      bearish_momentum: strategyReport.bearishMomentum,
      bearish_conviction: strategyReport.bearishConviction,
      trend_weakening: strategyReport.trendWeakening,
      tp: strategyReport.tp ? new Decimal(strategyReport.tp) : undefined,
      sl: strategyReport.sl ? new Decimal(strategyReport.sl) : undefined,
      ts: strategyReport.ts ? new Decimal(strategyReport.ts) : undefined,
      tp_price: strategyReport.tpPrice
        ? new Decimal(strategyReport.tpPrice)
        : undefined,
      sl_price: strategyReport.slPrice
        ? new Decimal(strategyReport.slPrice)
        : undefined,
      should_buy: strategyReport.shouldBuy,
      should_sell: strategyReport.shouldSell,
    }
  }
}
