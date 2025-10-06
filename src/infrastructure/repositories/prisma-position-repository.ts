import {
  Position as PrismaPosition,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { PositionRepository } from '../../domain/repositories/position-repository'
import { Position, positionSchema } from '../../domain/models/position'
import { prismaPositionSchema } from './schemas/prisma-position-schema'

export class PrismaPositionRepository implements PositionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(position: Position): Promise<Position> {
    return this.toDomain(
      await this.prisma.position.create({
        data: this.toPrisma(position),
      }),
    )
  }

  async get(symbol: string): Promise<Position | null> {
    const position = await this.prisma.position.findUnique({
      where: {
        symbol: symbol,
      },
    })

    if (!position) {
      return null
    }

    return this.toDomain(position)
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
    return prismaPositionSchema.parse(prismaPosition)
  }

  private toPrisma(position: Position): Prisma.PositionCreateInput {
    positionSchema.parse(position)

    return {
      symbol: position.symbol,
      entry_order_id: position.entryOrderId,
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
