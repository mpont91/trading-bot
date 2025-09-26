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
      isTrendingUp: prismaRisk.is_trending_up,
      isGoldenCross: prismaRisk.is_golden_cross,
      hasStrongTrend: prismaRisk.has_strong_trend,
      hasBullishDirection: prismaRisk.has_bullish_direction,
      hasBullishMomentum: prismaRisk.has_bullish_momentum,
      notOverextended: prismaRisk.not_overextended,
      isDeathCross: prismaRisk.is_death_cross,
      hasBearishMomentum: prismaRisk.has_bearish_momentum,
      trendIsWeakening: prismaRisk.trend_is_weakening,
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
      is_trending_up: risk.isTrendingUp,
      is_golden_cross: risk.isGoldenCross,
      has_strong_trend: risk.hasStrongTrend,
      has_bullish_direction: risk.hasBullishDirection,
      has_bullish_momentum: risk.hasBullishMomentum,
      not_overextended: risk.notOverextended,
      is_death_cross: risk.isDeathCross,
      has_bearish_momentum: risk.hasBearishMomentum,
      trend_is_weakening: risk.trendIsWeakening,
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
