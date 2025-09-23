import { Position } from '../../../domain/types/position'
import { RestTradeTypes } from '@binance/connector-typescript'

export function mapBinanceToDomainPosition(
  binanceOrder: RestTradeTypes.allOrdersResponse,
): Position {
  const quantity: number = parseFloat(binanceOrder.executedQty)
  const amount: number = parseFloat(binanceOrder.cummulativeQuoteQty)

  return {
    symbol: binanceOrder.symbol,
    quantity: quantity,
    price: amount / quantity,
    amount: amount,
    entryAt: new Date(binanceOrder.time),
  }
}
