import { Order as PrismaOrder, Prisma, PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js'
import { OrderRepository } from '../../domain/repositories/order-repository'
import { Order, OrderCreate } from '../../domain/models/order'
import { Side } from '../../domain/types/side'

export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(orderCreate: OrderCreate): Promise<Order> {
    return this.toDomain(
      await this.prisma.order.create({
        data: this.toPrisma(orderCreate),
      }),
    )
  }

  async get(id: number): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    return this.toDomain(order)
  }

  async list(): Promise<Order[]> {
    const limit: number = 10
    const orders = await this.prisma.order.findMany({
      take: limit,
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    return this.toDomainList(orders)
  }

  async last(symbol: string): Promise<Order | null> {
    const order = await this.prisma.order.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!order) {
      return null
    }

    return this.toDomain(order as PrismaOrder)
  }

  private toDomain(prismaOrder: PrismaOrder): Order {
    return {
      id: prismaOrder.id,
      orderId: prismaOrder.order_id,
      symbol: prismaOrder.symbol,
      side: prismaOrder.side as Side,
      quantity: prismaOrder.quantity.toNumber(),
      price: prismaOrder.price.toNumber(),
      amount: prismaOrder.amount.toNumber(),
      fees: prismaOrder.fees.toNumber(),
      createdAt: prismaOrder.created_at,
    }
  }

  private toPrisma(orderCreate: OrderCreate): Prisma.OrderCreateInput {
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

  private toDomainList(prismaOrders: PrismaOrder[]): Order[] {
    return prismaOrders.map(this.toDomain)
  }
}
