import { OrderCreate } from '../../../domain/models/order'
import { RestTradeTypes } from '@binance/connector-typescript'
import { mapBinanceToDomainSide } from './side-mapper'
import { Side } from '@binance/connector-typescript'
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
    side: mapBinanceToDomainSide(binanceOrder.side as Side),
    quantity: quantity,
    price: price,
    amount: quantity * price,
    fees: fees,
    createdAt: new Date(binanceOrder.time),
  }
}
