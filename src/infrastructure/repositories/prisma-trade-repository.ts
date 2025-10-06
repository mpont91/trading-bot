import { Trade as PrismaTrade, Prisma, PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js'
import { TradeRepository } from '../../domain/repositories/trade-repository'
import { Trade, TradeCreate } from '../../domain/models/trade'
import { Performance } from '../../domain/types/performance'
import {
  domainTradeSchema,
  prismaTradeSchema,
} from './schemas/prisma-trade-schema'

export class PrismaTradeRepository implements TradeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(tradeCreate: TradeCreate): Promise<Trade> {
    return this.toDomain(
      await this.prisma.trade.create({
        data: this.toPrisma(tradeCreate),
      }),
    )
  }

  async list(symbol?: string): Promise<Trade[]> {
    const limit: number = 10
    const queryOptions = {
      take: limit,
      where: {},
      orderBy: {
        exit_at: Prisma.SortOrder.desc,
      },
    }

    if (symbol) {
      queryOptions.where = {
        symbol: symbol,
      }
    }

    const trades = await this.prisma.trade.findMany(queryOptions)

    return this.toDomainList(trades)
  }

  async getPerformance(): Promise<Performance> {
    const trades = await this.prisma.trade.findMany()

    const totalTrades: number = trades.length
    const successTrades: number = trades.filter((t) => t.pnl.gt(0)).length
    const failedTrades: number = trades.filter((t) => t.pnl.lt(0)).length
    const totalPnl: Decimal = trades.reduce(
      (sum, t) => sum.plus(t.pnl),
      new Decimal(0),
    )
    const totalFees: Decimal = trades.reduce(
      (sum, t) => sum.plus(t.fees),
      new Decimal(0),
    )
    const netProfit: Decimal = totalPnl.minus(totalFees)

    return {
      trades: totalTrades,
      success: successTrades,
      failed: failedTrades,
      pnl: totalPnl.toNumber(),
      fees: totalFees.toNumber(),
      net: netProfit.toNumber(),
    }
  }

  private toDomain(prismaTrade: PrismaTrade): Trade {
    return domainTradeSchema.parse(prismaTrade)
  }

  private toPrisma(tradeCreate: TradeCreate): Prisma.TradeCreateInput {
    return prismaTradeSchema.parse(tradeCreate)
  }

  private toDomainList(prismaTrades: PrismaTrade[]): Trade[] {
    return prismaTrades.map(this.toDomain)
  }
}
