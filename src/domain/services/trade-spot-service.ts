import { TradeSpotCreate } from '../models/trade'
import { OrderSpot, OrderSpotCreate } from '../models/order'
import { TradeService } from './trade-service'

export class TradeSpotService extends TradeService {
  async storeTradeFromOrders(
    entryOrder: OrderSpot,
    exitOrder: OrderSpotCreate,
  ): Promise<void> {
    const trade: TradeSpotCreate = {
      symbol: entryOrder.symbol,
      side: entryOrder.side,
      quantity: entryOrder.quantity,
      entryOrderId: entryOrder.orderId,
      entryPrice: entryOrder.price,
      entryAt: entryOrder.createdAt,
      exitOrderId: exitOrder.orderId,
      exitPrice: exitOrder.price,
      exitAt: exitOrder.createdAt,
      fees: entryOrder.fees + exitOrder.fees,
      pnl: (exitOrder.price - entryOrder.price) * entryOrder.quantity,
    }

    await this.store(trade)
  }
}
