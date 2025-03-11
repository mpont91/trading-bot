import {
  TradeFutures as PrismaTradeFutures,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { TradeRepository } from '../../domain/repositories/trade-repository'
import { TradeFutures, TradeFuturesCreate } from '../../domain/models/trade'
import { Side } from '../../domain/types/side'
import { Performance } from '../../domain/types/performance'

export class PrismaTradeFuturesRepository implements TradeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(tradeCreate: TradeFuturesCreate): Promise<void> {
    await this.prisma.tradeFutures.create({
      data: this.toPrisma(tradeCreate),
    })
  }

  async getLastMany(limit: number = 5): Promise<TradeFutures[]> {
    const trades = await this.prisma.tradeFutures.findMany({
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
  ): Promise<TradeFutures[]> {
    const trades = await this.prisma.tradeFutures.findMany({
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
    const trades = await this.prisma.tradeFutures.findMany()

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

  private toDomain(prismaTradeFutures: PrismaTradeFutures): TradeFutures {
    return {
      id: prismaTradeFutures.id,
      symbol: prismaTradeFutures.symbol,
      side: prismaTradeFutures.side as Side,
      quantity: prismaTradeFutures.quantity.toNumber(),
      contractSize: prismaTradeFutures.contract_size.toNumber(),
      leverage: prismaTradeFutures.leverage,
      entryOrderId: prismaTradeFutures.entry_order_id,
      entryPrice: prismaTradeFutures.entry_price.toNumber(),
      entryAt: prismaTradeFutures.entry_at,
      exitOrderId: prismaTradeFutures.exit_order_id,
      exitPrice: prismaTradeFutures.exit_price.toNumber(),
      exitAt: prismaTradeFutures.exit_at,
      fees: prismaTradeFutures.fees.toNumber(),
      pnl: prismaTradeFutures.pnl.toNumber(),
    }
  }

  private toPrisma(
    tradeCreate: TradeFuturesCreate,
  ): Prisma.TradeFuturesCreateInput {
    return {
      symbol: tradeCreate.symbol,
      side: tradeCreate.side,
      quantity: new Decimal(tradeCreate.quantity),
      contract_size: new Decimal(tradeCreate.contractSize),
      leverage: tradeCreate.leverage,
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

  private toDomainList(
    prismaTradesFutures: PrismaTradeFutures[],
  ): TradeFutures[] {
    return prismaTradesFutures.map(this.toDomain)
  }
}
