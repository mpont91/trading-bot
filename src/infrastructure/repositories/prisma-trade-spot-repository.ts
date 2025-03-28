import {
  TradeSpot as PrismaTradeSpot,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { TradeRepository } from '../../domain/repositories/trade-repository'
import { TradeSpot, TradeSpotCreate } from '../../domain/models/trade'
import { Side } from '../../domain/types/side'
import { Performance } from '../../domain/types/performance'

export class PrismaTradeSpotRepository implements TradeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(tradeCreate: TradeSpotCreate): Promise<void> {
    await this.prisma.tradeSpot.create({
      data: this.toPrisma(tradeCreate),
    })
  }

  async getLastMany(limit: number = 10): Promise<TradeSpot[]> {
    const trades = await this.prisma.tradeSpot.findMany({
      take: limit,
      orderBy: {
        exit_at: Prisma.SortOrder.desc,
      },
    })

    return this.toDomainList(trades)
  }

  async getLastManyForSymbol(
    symbol: string,
    limit: number = 10,
  ): Promise<TradeSpot[]> {
    const trades = await this.prisma.tradeSpot.findMany({
      take: limit,
      where: {
        symbol: symbol,
      },
      orderBy: {
        exit_at: Prisma.SortOrder.desc,
      },
    })

    return this.toDomainList(trades)
  }

  async getPerformance(): Promise<Performance> {
    const trades = await this.prisma.tradeSpot.findMany()

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

  private toDomain(prismaTradeSpot: PrismaTradeSpot): TradeSpot {
    return {
      id: prismaTradeSpot.id,
      symbol: prismaTradeSpot.symbol,
      side: prismaTradeSpot.side as Side,
      quantity: prismaTradeSpot.quantity.toNumber(),
      entryOrderId: prismaTradeSpot.entry_order_id,
      entryPrice: prismaTradeSpot.entry_price.toNumber(),
      entryAt: prismaTradeSpot.entry_at,
      exitOrderId: prismaTradeSpot.exit_order_id,
      exitPrice: prismaTradeSpot.exit_price.toNumber(),
      exitAt: prismaTradeSpot.exit_at,
      fees: prismaTradeSpot.fees.toNumber(),
      pnl: prismaTradeSpot.pnl.toNumber(),
    }
  }

  private toPrisma(tradeCreate: TradeSpotCreate): Prisma.TradeSpotCreateInput {
    return {
      symbol: tradeCreate.symbol,
      side: tradeCreate.side,
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

  private toDomainList(prismaTradesSpot: PrismaTradeSpot[]): TradeSpot[] {
    return prismaTradesSpot.map(this.toDomain)
  }
}
