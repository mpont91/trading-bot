import {
  Strategy as PrismaStrategy,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { StrategyRepository } from '../../domain/repositories/strategy-repository'
import { Strategy, StrategyCreate } from '../../domain/models/strategy'
import { Side } from '../../domain/types/side'
import { getEmptyStrategy } from '../../domain/helpers/strategy-helper'

export class PrismaStrategyRepository implements StrategyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(strategy: StrategyCreate): Promise<void> {
    await this.prisma.strategy.create({
      data: this.toPrisma(strategy),
    })
  }

  async getLatest(): Promise<Strategy[]> {
    const strategies: PrismaStrategy[] = await this.prisma.$queryRaw<
      PrismaStrategy[]
    >`
SELECT s.*
FROM strategy s
    INNER JOIN (
        SELECT symbol, MAX(created_at) AS max_created_at
        FROM strategy
        GROUP BY symbol
    ) latest 
    ON s.symbol = latest.symbol 
    AND s.created_at = latest.max_created_at`

    return this.toDomainList(strategies)
  }

  async getLatestForSymbol(symbol: string): Promise<Strategy> {
    const strategy = await this.prisma.strategy.findFirst({
      where: {
        symbol: symbol,
      },
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    if (!strategy) {
      return getEmptyStrategy(symbol)
    }

    return this.toDomain(strategy as PrismaStrategy)
  }

  async getLatestOpportunities(): Promise<Strategy[]> {
    const strategies: PrismaStrategy[] = await this.prisma.$queryRaw<
      PrismaStrategy[]
    >`
SELECT s.*
FROM strategy s
    INNER JOIN (
        SELECT symbol, MAX(created_at) AS max_created_at
        FROM strategy
        WHERE side <> 'hold'
        GROUP BY symbol
    ) latest 
    ON s.symbol = latest.symbol 
    AND s.created_at = latest.max_created_at`

    return this.toDomainList(strategies)
  }

  private toDomain(prismaStrategy: PrismaStrategy): Strategy {
    return {
      id: prismaStrategy.id,
      symbol: prismaStrategy.symbol,
      price: prismaStrategy.price.toNumber(),
      side: prismaStrategy.side as Side,
      tp: prismaStrategy.tp ? prismaStrategy.tp.toNumber() : undefined,
      sl: prismaStrategy.sl ? prismaStrategy.sl.toNumber() : undefined,
      leverage: prismaStrategy.leverage ? prismaStrategy.leverage : undefined,
      createdAt: prismaStrategy.created_at,
    }
  }

  private toPrisma(strategyCreate: StrategyCreate): Prisma.StrategyCreateInput {
    return {
      symbol: strategyCreate.symbol,
      price: new Decimal(strategyCreate.price),
      side: strategyCreate.side,
      tp: strategyCreate.tp ? new Decimal(strategyCreate.tp) : undefined,
      sl: strategyCreate.sl ? new Decimal(strategyCreate.sl) : undefined,
      leverage: strategyCreate.leverage ? strategyCreate.leverage : undefined,
    }
  }

  private toDomainList(prismaStrategy: PrismaStrategy[]): Strategy[] {
    return prismaStrategy.map(this.toDomain)
  }
}
