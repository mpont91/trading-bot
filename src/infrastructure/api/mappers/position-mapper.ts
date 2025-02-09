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
  return {
    symbol: bitmartPosition.symbol,
    side: mapBitmartToDomainPositionSide(bitmartPosition.position_type),
    quantity: parseFloat(bitmartPosition.current_amount),
    leverage: parseInt(bitmartPosition.leverage),
    price: parseFloat(bitmartPosition.entry_price),
    entryAt: new Date(bitmartPosition.open_timestamp),
  }
}

export function mapBinanceToDomainPosition(
  binanceOrder: RestTradeTypes.allOrdersResponse,
): PositionSpot {
  return {
    symbol: binanceOrder.symbol,
    side: mapBinanceToDomainSide(binanceOrder.side as Side),
    quantity: parseFloat(binanceOrder.executedQty),
    price:
      parseFloat(binanceOrder.cummulativeQuoteQty) /
      parseFloat(binanceOrder.executedQty),
    entryAt: new Date(binanceOrder.time),
  }
}
