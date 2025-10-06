import {
  Position as PrismaPosition,
  Prisma,
  PrismaClient,
} from '@prisma/client'

import { PositionRepository } from '../../domain/repositories/position-repository'
import { Position } from '../../domain/models/position'
import {
  domainPositionSchema,
  prismaPositionSchema,
} from './schemas/prisma-position-schema'

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
    return domainPositionSchema.parse(prismaPosition)
  }

  private toPrisma(position: Position): Prisma.PositionCreateInput {
    return prismaPositionSchema.parse(position)
  }

  private toDomainList(prismaPosition: PrismaPosition[]): Position[] {
    return prismaPosition.map(this.toDomain)
  }
}
