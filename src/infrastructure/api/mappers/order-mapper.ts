import { OrderCreate } from '../../../domain/models/order'
import { RestTradeTypes } from '@binance/connector-typescript'
import { mapBinanceToDomainSide, mapBitmartToDomainSide } from './side-mapper'
import { Side } from '@binance/connector-typescript'
import { FuturesAccountTrade } from 'bitmart-api/dist/mjs/types/response/futures.types'
import { FuturesAccountOrder } from 'bitmart-api'
import { settings } from '../../../application/settings'

export function mapBinanceToDomainOrder(
  binanceOrder: RestTradeTypes.getOrderResponse,
  binanceTrades: RestTradeTypes.accountTradeListResponse[],
  feeCurrencyPrice: number,
): OrderCreate {
  let quantity: number = 0
  let fees: number = 0
  let weightedPrice: number = 0

  for (const binanceTrade of binanceTrades) {
    const qty: number = parseFloat(binanceTrade.qty)
    const price: number = parseFloat(binanceTrade.price)
    const fee: number = parseFloat(binanceTrade.commission)
    const feeCurrency: string = binanceTrade.commissionAsset

    quantity += qty
    weightedPrice += price * qty

    if (settings.binance.feeCurrency === feeCurrency) {
      fees += fee * feeCurrencyPrice
    } else {
      fees += fee
    }
  }

  const price: number =
    quantity > 0 ? weightedPrice / quantity : parseFloat(binanceOrder.price)

  return {
    orderId: binanceOrder.orderId.toString(),
    symbol: binanceOrder.symbol,
    side: mapBinanceToDomainSide(<Side>binanceOrder.side),
    quantity: quantity,
    leverage: 1,
    price: price,
    fees: fees,
    createdAt: new Date(binanceOrder.time),
  }
}
export function mapBitmartToDomainOrder(
  bitmartOrder: FuturesAccountOrder,
  bitmartTrades: FuturesAccountTrade[],
): OrderCreate {
  const fees: number = bitmartTrades.reduce(
    (total: number, bitmartTrade: FuturesAccountTrade) =>
      total + parseFloat(bitmartTrade.paid_fees),
    0,
  )

  return {
    orderId: bitmartOrder.order_id,
    symbol: bitmartOrder.symbol,
    side: mapBitmartToDomainSide(bitmartOrder.side),
    quantity: parseInt(bitmartOrder.size),
    leverage: parseInt(bitmartOrder.leverage),
    price: parseFloat(bitmartOrder.price),
    fees: fees,
    createdAt: new Date(),
  }
}
