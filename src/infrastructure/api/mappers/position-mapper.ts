import { FuturesAccountPosition } from 'bitmart-api'
import { PositionFutures, PositionSpot } from '../../../domain/types/position'
import {
  mapBinanceToDomainSide,
  mapBitmartToDomainPositionSide,
} from './side-mapper'
import { RestTradeTypes, Side } from '@binance/connector-typescript'

export function mapBitmartToDomainPosition(
  bitmartPosition: FuturesAccountPosition,
): PositionFutures {
  const quantity: number = parseFloat(bitmartPosition.current_amount)
  const leverage: number = parseInt(bitmartPosition.leverage)
  const price: number = parseFloat(bitmartPosition.entry_price)
  const amount: number = parseFloat(bitmartPosition.position_value)
  const amountLeveraged: number = amount / leverage

  return {
    symbol: bitmartPosition.symbol,
    side: mapBitmartToDomainPositionSide(bitmartPosition.position_type),
    quantity: quantity,
    price: price,
    amount: amount,
    amountLeveraged: amountLeveraged,
    contractSize: amount / (quantity * price),
    leverage: leverage,
    entryAt: new Date(bitmartPosition.open_timestamp),
  }
}

export function mapBinanceToDomainPosition(
  binanceOrder: RestTradeTypes.allOrdersResponse,
): PositionSpot {
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
