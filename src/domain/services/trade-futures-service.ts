import { TradeCreate, TradeFuturesCreate } from '../models/trade'
import { OrderFutures, OrderFuturesCreate } from '../models/order'
import { TradeService } from './trade-service'

export class TradeFuturesService extends TradeService {
  async storeTradeFromOrders(
    entryOrder: OrderFutures,
    exitOrder: OrderFuturesCreate,
  ): Promise<void> {
    const trade: TradeFuturesCreate = {
      type: 'futures',
      symbol: entryOrder.symbol,
      side: entryOrder.side,
      quantity: entryOrder.quantity,
      contractSize: entryOrder.contractSize,
      leverage: entryOrder.leverage,
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
