import {
  Trailing as PrismaTrailing,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
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

  async list(): Promise<Trailing[]> {
    const trailingList = await this.prisma.trailing.findMany()

    return this.toDomainList(trailingList)
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
      tp: prismaTrailing.tp.toNumber(),
      sl: prismaTrailing.sl.toNumber(),
      createdAt: prismaTrailing.created_at,
    }
  }

  private toPrisma(trailing: TrailingCreate): Prisma.TrailingCreateInput {
    return {
      symbol: trailing.symbol,
      tp: new Decimal(trailing.tp),
      sl: new Decimal(trailing.sl),
    }
  }

  private toDomainList(prismaTrailing: PrismaTrailing[]): Trailing[] {
    return prismaTrailing.map(this.toDomain)
  }
}
