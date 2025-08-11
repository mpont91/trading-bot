import { Position } from '../../../domain/types/position'
import { mapBinanceToDomainSide } from './side-mapper'
import { RestTradeTypes, Side } from '@binance/connector-typescript'

export function mapBinanceToDomainPosition(
  binanceOrder: RestTradeTypes.allOrdersResponse,
): Position {
  const quantity: number = parseFloat(binanceOrder.executedQty)
  const amount: number = parseFloat(binanceOrder.cummulativeQuoteQty)

  return {
    symbol: binanceOrder.symbol,
    side: mapBinanceToDomainSide(binanceOrder.side as Side),
    quantity: quantity,
    price: amount / quantity,
    amount: amount,
    entryAt: new Date(binanceOrder.time),
  }
}
