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

  async getLastOrderForSymbol(symbol: string): Promise<OrderFutures | null> {
    const order = await this.prisma.orderFutures.findFirst({
      where: { symbol },
      orderBy: { created_at: Prisma.SortOrder.desc },
    })

    if (!order) {
      return null
    }

    return this.toDomain(order as PrismaOrderFutures)
  }

  private toDomain(prismaOrderFutures: PrismaOrderFutures): OrderFutures {
    return {
      id: prismaOrderFutures.id,
      orderId: prismaOrderFutures.order_id,
      symbol: prismaOrderFutures.symbol,
      side: prismaOrderFutures.side as Side,
      quantity: prismaOrderFutures.quantity.toNumber(),
      contractSize: prismaOrderFutures.contract_size.toNumber(),
      leverage: prismaOrderFutures.leverage,
      price: prismaOrderFutures.price.toNumber(),
      amount: prismaOrderFutures.amount.toNumber(),
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
      contract_size: new Decimal(orderCreate.contractSize),
      leverage: orderCreate.leverage,
      price: new Decimal(orderCreate.price),
      amount: new Decimal(orderCreate.amount),
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
