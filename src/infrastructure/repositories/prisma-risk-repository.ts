import { Risk as PrismaRisk, Prisma, PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js'
import { RiskRepository } from '../../domain/repositories/risk-repository'
import { Risk, RiskCreate } from '../../domain/models/risk'

export class PrismaRiskRepository implements RiskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(risk: RiskCreate): Promise<Risk> {
    return this.toDomain(
      await this.prisma.risk.create({
        data: this.toPrisma(risk),
      }),
    )
  }

  private toDomain(prismaRisk: PrismaRisk): Risk {
    return {
      id: prismaRisk.id,
      symbol: prismaRisk.symbol,
      price: prismaRisk.price.toNumber(),
      trendUp: prismaRisk.trend_up,
      goldenCross: prismaRisk.golden_cross,
      strongTrend: prismaRisk.strong_trend,
      bullishDirection: prismaRisk.bullish_direction,
      bullishMomentum: prismaRisk.bullish_momentum,
      notOverextended: prismaRisk.not_overextended,
      deathCross: prismaRisk.death_cross,
      bearishMomentum: prismaRisk.bearish_momentum,
      trendWeakening: prismaRisk.trend_weakening,
      tp: prismaRisk.tp ? prismaRisk.tp.toNumber() : undefined,
      sl: prismaRisk.sl ? prismaRisk.sl.toNumber() : undefined,
      ts: prismaRisk.ts ? prismaRisk.ts.toNumber() : undefined,
      tpPrice: prismaRisk.tp_price ? prismaRisk.tp_price.toNumber() : undefined,
      slPrice: prismaRisk.sl_price ? prismaRisk.sl_price.toNumber() : undefined,
      shouldBuy: prismaRisk.should_buy,
      shouldSell: prismaRisk.should_sell,
      createdAt: prismaRisk.created_at,
    }
  }

  private toPrisma(risk: RiskCreate): Prisma.RiskCreateInput {
    return {
      symbol: risk.symbol,
      price: risk.price,
      trend_up: risk.trendUp,
      golden_cross: risk.goldenCross,
      strong_trend: risk.strongTrend,
      bullish_direction: risk.bullishDirection,
      bullish_momentum: risk.bullishMomentum,
      not_overextended: risk.notOverextended,
      death_cross: risk.deathCross,
      bearish_momentum: risk.bearishMomentum,
      trend_weakening: risk.trendWeakening,
      tp: risk.tp ? new Decimal(risk.tp) : undefined,
      sl: risk.sl ? new Decimal(risk.sl) : undefined,
      ts: risk.ts ? new Decimal(risk.ts) : undefined,
      tp_price: risk.tpPrice ? new Decimal(risk.tpPrice) : undefined,
      sl_price: risk.slPrice ? new Decimal(risk.slPrice) : undefined,
      should_buy: risk.shouldBuy,
      should_sell: risk.shouldSell,
    }
  }
}
