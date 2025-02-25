import {
  TrailingSpot as PrismaTrailingSpot,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { Side } from '../../domain/types/side'
import { TrailingRepository } from '../../domain/repositories/trailing-repository'
import { Trailing, TrailingCreate } from '../../domain/models/trailing'

export class PrismaTrailingSpotRepository implements TrailingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(trailing: TrailingCreate): Promise<void> {
    await this.prisma.trailingSpot.create({
      data: this.toPrisma(trailing),
    })
  }

  async get(symbol: string): Promise<Trailing | null> {
    const trailing = await this.prisma.trailingSpot.findFirst({
      where: {
        symbol: symbol,
      },
    })

    if (!trailing) {
      return null
    }

    return this.toDomain(trailing as PrismaTrailingSpot)
  }

  async remove(symbol: string): Promise<void> {
    await this.prisma.trailingSpot.delete({
      where: {
        symbol: symbol,
      },
    })
  }

  private toDomain(prismaTrailingSpot: PrismaTrailingSpot): Trailing {
    return {
      symbol: prismaTrailingSpot.symbol,
      side: prismaTrailingSpot.side as Side,
      tp: prismaTrailingSpot.tp ? prismaTrailingSpot.tp.toNumber() : undefined,
      sl: prismaTrailingSpot.sl ? prismaTrailingSpot.sl.toNumber() : undefined,
      createdAt: prismaTrailingSpot.created_at,
    }
  }

  private toPrisma(trailing: TrailingCreate): Prisma.TrailingSpotCreateInput {
    return {
      symbol: trailing.symbol,
      side: trailing.side,
      tp: trailing.tp ? new Decimal(trailing.tp) : undefined,
      sl: trailing.sl ? new Decimal(trailing.sl) : undefined,
    }
  }
}
