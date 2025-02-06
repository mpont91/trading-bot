import {
  OrderFutures as PrismaOrderFutures,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { OrderRepository } from '../../domain/repositories/order-repository'
import { OrderFutures, OrderFuturesCreate } from '../../domain/models/order'
import { Side } from '../../domain/types/side'

export class PrismaOrderFuturesRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(orderCreate: OrderFuturesCreate): Promise<void> {
    await this.prisma.orderFutures.create({
      data: this.toPrisma(orderCreate),
    })
  }

  async getLatest(limit: number = 5): Promise<OrderFutures[]> {
    const orders = await this.prisma.orderFutures.findMany({
      take: limit,
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    return this.toDomainList(orders)
  }

  private toDomain(prismaOrderFutures: PrismaOrderFutures): OrderFutures {
    return {
      type: 'futures',
      id: prismaOrderFutures.id,
      orderId: prismaOrderFutures.order_id,
      symbol: prismaOrderFutures.symbol,
      side: prismaOrderFutures.side as Side,
      quantity: prismaOrderFutures.quantity.toNumber(),
      leverage: prismaOrderFutures.leverage,
      price: prismaOrderFutures.price.toNumber(),
      fees: prismaOrderFutures.fees.toNumber(),
      createdAt: prismaOrderFutures.created_at,
    }
  }

  private toPrisma(
    orderCreate: OrderFuturesCreate,
  ): Prisma.OrderFuturesCreateInput {
    return {
      order_id: orderCreate.orderId,
      symbol: orderCreate.symbol,
      side: orderCreate.side,
      quantity: new Decimal(orderCreate.quantity),
      leverage: orderCreate.leverage,
      price: new Decimal(orderCreate.price),
      fees: new Decimal(orderCreate.fees),
      created_at: orderCreate.createdAt,
    }
  }

  private toDomainList(
    prismaOrdersFutures: PrismaOrderFutures[],
  ): OrderFutures[] {
    return prismaOrdersFutures.map(this.toDomain)
  }
}
