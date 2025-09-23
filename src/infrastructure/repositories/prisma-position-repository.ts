import {
  Position as PrismaPosition,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { PositionRepository } from '../../domain/repositories/position-repository'
import { Position } from '../../domain/models/position'

export class PrismaPositionRepository implements PositionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(position: Position): Promise<void> {
    await this.prisma.position.create({
      data: this.toPrisma(position),
    })
  }

  async get(symbol: string): Promise<Position | null> {
    const position = await this.prisma.position.findFirst({
      where: {
        symbol: symbol,
      },
    })

    if (!position) {
      return null
    }

    return this.toDomain(position as PrismaPosition)
  }

  async list(): Promise<Position[]> {
    const positionList = await this.prisma.position.findMany()

    return this.toDomainList(positionList)
  }

  async remove(symbol: string): Promise<void> {
    await this.prisma.position.delete({
      where: {
        symbol: symbol,
      },
    })
  }

  private toDomain(prismaPosition: PrismaPosition): Position {
    return {
      symbol: prismaPosition.symbol,
      quantity: prismaPosition.quantity.toNumber(),
      price: prismaPosition.price.toNumber(),
      amount: prismaPosition.amount.toNumber(),
      entryAt: prismaPosition.entry_at,
    }
  }

  private toPrisma(position: Position): Prisma.PositionCreateInput {
    return {
      symbol: position.symbol,
      quantity: new Decimal(position.quantity),
      price: new Decimal(position.price),
      amount: new Decimal(position.amount),
      entry_at: position.entryAt,
    }
  }

  private toDomainList(prismaPosition: PrismaPosition[]): Position[] {
    return prismaPosition.map(this.toDomain)
  }
}
