import {
  Trailing as PrismaTrailing,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { TrailingRepository } from '../../domain/repositories/trailing-repository'
import { Trailing, TrailingCreate } from '../../domain/models/trailing'
import {
  domainTrailingSchema,
  prismaTrailingSchema,
} from './schemas/prisma-trailing-schema'

export class PrismaTrailingRepository implements TrailingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(trailing: TrailingCreate): Promise<Trailing> {
    return this.toDomain(
      await this.prisma.trailing.create({
        data: this.toPrisma(trailing),
      }),
    )
  }

  async get(symbol: string): Promise<Trailing | null> {
    const trailing = await this.prisma.trailing.findUnique({
      where: {
        symbol: symbol,
      },
    })

    if (!trailing) {
      return null
    }

    return this.toDomain(trailing)
  }

  async updateTsPrice(symbol: string, tsPrice: number): Promise<Trailing> {
    return this.toDomain(
      await this.prisma.trailing.update({
        where: {
          symbol: symbol,
        },
        data: {
          ts_price: new Decimal(tsPrice),
        },
      }),
    )
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
    return domainTrailingSchema.parse(prismaTrailing)
  }

  private toPrisma(trailing: TrailingCreate): Prisma.TrailingCreateInput {
    return prismaTrailingSchema.parse(trailing)
  }

  private toDomainList(prismaTrailing: PrismaTrailing[]): Trailing[] {
    return prismaTrailing.map(this.toDomain)
  }
}
