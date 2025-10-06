import { Order as PrismaOrder, Prisma, PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js'
import { OrderRepository } from '../../domain/repositories/order-repository'
import {
  Order,
  OrderCreate,
  orderCreateSchema,
} from '../../domain/models/order'
import { prismaOrderSchema } from './schemas/prisma-order-schema'

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

  private toDomain(prismaOrder: PrismaOrder): Order {
    return prismaOrderSchema.parse(prismaOrder)
  }

  private toPrisma(orderCreate: OrderCreate): Prisma.OrderCreateInput {
    orderCreateSchema.parse(orderCreate)

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
