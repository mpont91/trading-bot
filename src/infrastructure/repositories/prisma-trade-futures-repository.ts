import {
  TradeFutures as PrismaTradeFutures,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { TradeRepository } from '../../domain/repositories/trade-repository'
import { TradeFutures, TradeFuturesCreate } from '../../domain/models/trade'
import { Side } from '../../domain/types/side'

export class PrismaTradeFuturesRepository implements TradeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(tradeCreate: TradeFuturesCreate): Promise<void> {
    await this.prisma.tradeFutures.create({
      data: this.toPrisma(tradeCreate),
    })
  }

  async getLatest(limit: number = 5): Promise<TradeFutures[]> {
    const trades = await this.prisma.tradeFutures.findMany({
      take: limit,
      orderBy: {
        exit_at: Prisma.SortOrder.desc,
      },
    })

    return this.toDomainList(trades)
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
