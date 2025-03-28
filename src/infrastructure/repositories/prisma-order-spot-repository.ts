import {
  OrderSpot as PrismaOrderSpot,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { OrderRepository } from '../../domain/repositories/order-repository'
import { OrderSpot, OrderSpotCreate } from '../../domain/models/order'
import { Side } from '../../domain/types/side'

export class PrismaOrderSpotRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(orderCreate: OrderSpotCreate): Promise<void> {
    await this.prisma.orderSpot.create({
      data: this.toPrisma(orderCreate),
    })
  }

  async getLastMany(limit: number = 10): Promise<OrderSpot[]> {
    const orders = await this.prisma.orderSpot.findMany({
      take: limit,
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    return this.toDomainList(orders)
  }

  async getLastOrderForSymbol(symbol: string): Promise<OrderSpot | null> {
    const order = await this.prisma.orderSpot.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!order) {
      return null
    }

    return this.toDomain(order as PrismaOrderSpot)
  }

  private toDomain(prismaOrderSpot: PrismaOrderSpot): OrderSpot {
    return {
      id: prismaOrderSpot.id,
      orderId: prismaOrderSpot.order_id,
      symbol: prismaOrderSpot.symbol,
      side: prismaOrderSpot.side as Side,
      quantity: prismaOrderSpot.quantity.toNumber(),
      price: prismaOrderSpot.price.toNumber(),
      amount: prismaOrderSpot.amount.toNumber(),
      fees: prismaOrderSpot.fees.toNumber(),
      createdAt: prismaOrderSpot.created_at,
    }
  }

  private toPrisma(orderCreate: OrderSpotCreate): Prisma.OrderSpotCreateInput {
    return {
      order_id: orderCreate.orderId,
      symbol: orderCreate.symbol,
      side: orderCreate.side,
      quantity: new Decimal(orderCreate.quantity),
      price: new Decimal(orderCreate.price),
      amount: new Decimal(orderCreate.amount),
      fees: new Decimal(orderCreate.fees),
      created_at: orderCreate.createdAt,
    }
  }

  private toDomainList(prismaOrdersSpot: PrismaOrderSpot[]): OrderSpot[] {
    return prismaOrdersSpot.map(this.toDomain)
  }
}
