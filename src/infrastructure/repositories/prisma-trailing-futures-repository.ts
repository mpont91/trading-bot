import {
  TrailingFutures as PrismaTrailingFutures,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { Side } from '../../domain/types/side'
import { TrailingRepository } from '../../domain/repositories/trailing-repository'
import { Trailing, TrailingCreate } from '../../domain/models/trailing'

export class PrismaTrailingFuturesRepository implements TrailingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(trailing: TrailingCreate): Promise<void> {
    await this.prisma.trailingFutures.create({
      data: this.toPrisma(trailing),
    })
  }

  async get(symbol: string): Promise<Trailing | null> {
    const trailing = await this.prisma.trailingFutures.findFirst({
      where: {
        symbol: symbol,
      },
    })

    if (!trailing) {
      return null
    }

    return this.toDomain(trailing as PrismaTrailingFutures)
  }

  async remove(symbol: string): Promise<void> {
    await this.prisma.trailingFutures.delete({
      where: {
        symbol: symbol,
      },
    })
  }

  private toDomain(prismaTrailingFutures: PrismaTrailingFutures): Trailing {
    return {
      symbol: prismaTrailingFutures.symbol,
      side: prismaTrailingFutures.side as Side,
      tp: prismaTrailingFutures.tp.toNumber(),
      sl: prismaTrailingFutures.sl.toNumber(),
      createdAt: prismaTrailingFutures.created_at,
    }
  }

  private toPrisma(
    trailing: TrailingCreate,
  ): Prisma.TrailingFuturesCreateInput {
    return {
      symbol: trailing.symbol,
      side: trailing.side,
      tp: new Decimal(trailing.tp),
      sl: new Decimal(trailing.sl),
    }
  }
}
