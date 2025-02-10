import {
  OrderFuturesCreate,
  OrderSpotCreate,
} from '../../../domain/models/order'
import { RestTradeTypes } from '@binance/connector-typescript'
import {
  mapBinanceToDomainSide,
  mapBitmartToDomainOrderSide,
} from './side-mapper'
import { Side } from '@binance/connector-typescript'
import { FuturesAccountTrade } from 'bitmart-api/dist/mjs/types/response/futures.types'
import { FuturesAccountOrder } from 'bitmart-api'
import { settings } from '../../../application/settings'
import { Symbol } from '../../../domain/types/symbol'

export function mapBinanceToDomainOrder(
  binanceOrder: RestTradeTypes.getOrderResponse,
  binanceTrades: RestTradeTypes.accountTradeListResponse[],
  feeCurrencyPrice: number,
): OrderSpotCreate {
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
    side: mapBinanceToDomainSide(binanceOrder.side as Side),
    quantity: quantity,
    price: price,
    amount: quantity * price,
    fees: fees,
    createdAt: new Date(binanceOrder.time),
  }
}
export function mapBitmartToDomainOrder(
  bitmartOrder: FuturesAccountOrder,
  bitmartTrades: FuturesAccountTrade[],
  symbol: Symbol,
): OrderFuturesCreate {
  const price: number = parseFloat(bitmartOrder.deal_avg_price)
  const quantity: number = parseInt(bitmartOrder.deal_size)
  const contractSize: number = symbol.contractSize
  const leverage: number = parseInt(bitmartOrder.leverage)
  const amountLeveraged: number = quantity * contractSize * price
  const amount: number = amountLeveraged / leverage

  const filteredTrades: FuturesAccountTrade[] = bitmartTrades.filter(
    (trade: FuturesAccountTrade): boolean =>
      trade.order_id === bitmartOrder.order_id,
  )

  const fees: number = filteredTrades.reduce(
    (total: number, bitmartTrade: FuturesAccountTrade) =>
      total + parseFloat(bitmartTrade.paid_fees),
    0,
  )

  return {
    orderId: bitmartOrder.order_id,
    symbol: bitmartOrder.symbol,
    side: mapBitmartToDomainOrderSide(bitmartOrder.side),
    quantity: quantity,
    contractSize: contractSize,
    leverage: leverage,
    price: price,
    amount: amount,
    amountLeveraged: amountLeveraged,
    fees: fees,
    createdAt: new Date(bitmartOrder.create_time),
  }
}
