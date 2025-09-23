import { Trade as PrismaTrade, Prisma, PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js'
import { TradeRepository } from '../../domain/repositories/trade-repository'
import { Trade, TradeCreate } from '../../domain/models/trade'
import { Performance } from '../../domain/types/performance'

export class PrismaTradeRepository implements TradeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(tradeCreate: TradeCreate): Promise<void> {
    await this.prisma.trade.create({
      data: this.toPrisma(tradeCreate),
    })
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
    return {
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
    }
  }

  private toPrisma(tradeCreate: TradeCreate): Prisma.TradeCreateInput {
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
  }

  private toDomainList(prismaTrades: PrismaTrade[]): Trade[] {
    return prismaTrades.map(this.toDomain)
  }
}
