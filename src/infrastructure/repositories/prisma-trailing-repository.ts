import {
  Trailing as PrismaTrailing,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { Side } from '../../domain/types/side'
import { TrailingRepository } from '../../domain/repositories/trailing-repository'
import { Trailing, TrailingCreate } from '../../domain/models/trailing'

export class PrismaTrailingRepository implements TrailingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(trailing: TrailingCreate): Promise<void> {
    await this.prisma.trailing.create({
      data: this.toPrisma(trailing),
    })
  }

  async get(symbol: string): Promise<Trailing | null> {
    const trailing = await this.prisma.trailing.findFirst({
      where: {
        symbol: symbol,
      },
    })

    if (!trailing) {
      return null
    }

    return this.toDomain(trailing as PrismaTrailing)
  }

  async remove(symbol: string): Promise<void> {
    await this.prisma.trailing.delete({
      where: {
        symbol: symbol,
      },
    })
  }

  private toDomain(prismaTrailing: PrismaTrailing): Trailing {
    return {
      symbol: prismaTrailing.symbol,
      side: prismaTrailing.side as Side,
      tp: prismaTrailing.tp ? prismaTrailing.tp.toNumber() : undefined,
      sl: prismaTrailing.sl ? prismaTrailing.sl.toNumber() : undefined,
      createdAt: prismaTrailing.created_at,
    }
  }

  private toPrisma(trailing: TrailingCreate): Prisma.TrailingCreateInput {
    return {
      symbol: trailing.symbol,
      side: trailing.side,
      tp: trailing.tp ? new Decimal(trailing.tp) : undefined,
      sl: trailing.sl ? new Decimal(trailing.sl) : undefined,
    }
  }
}
