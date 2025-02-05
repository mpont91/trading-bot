import { OrderCreate } from '../../../domain/models/order'
import { RestTradeTypes } from '@binance/connector-typescript'
import { mapBinanceToDomainSide, mapBitmartToDomainSide } from './side-mapper'
import { Side } from '@binance/connector-typescript'
import { FuturesAccountTrade } from 'bitmart-api/dist/mjs/types/response/futures.types'
import { FuturesAccountOrder } from 'bitmart-api'

export function mapBinanceToDomainOrder(
  binanceOrder: RestTradeTypes.getOrderResponse,
  BinanceTrades: RestTradeTypes.accountTradeListResponse[],
): OrderCreate {
  return {
    orderId: binanceOrder.orderId.toString(),
    symbol: binanceOrder.symbol,
    side: mapBinanceToDomainSide(<Side>binanceOrder.side),
    quantity: 1,
    leverage: 1,
    price: 1,
    fees: 1,
    createdAt: new Date(binanceOrder.time),
  }
}
export function mapBitmartToDomainOrder(
  bitmartOrder: FuturesAccountOrder,
  bitmartTrades: FuturesAccountTrade[],
): OrderCreate {
  return {
    orderId: bitmartOrder.order_id,
    symbol: bitmartOrder.symbol,
    side: mapBitmartToDomainSide(bitmartOrder.side),
    quantity: parseInt(bitmartOrder.size),
    leverage: parseInt(bitmartOrder.leverage),
    price: parseFloat(bitmartOrder.price),
    fees: 1,
    createdAt: new Date(),
  }
}
