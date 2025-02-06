import { PositionService } from './position-service'
import { OrderFuturesRequest } from '../models/order'
import { PositionFutures } from '../types/position'
import { inverseSide } from '../helpers/side-helper'

export class PositionFuturesService extends PositionService {
  createOpenPositionOrderRequest(
    symbol: string,
    quantity: number,
  ): OrderFuturesRequest {
    return {
      type: 'futures',
      symbol: symbol,
      side: 'long',
      quantity: quantity,
      leverage: 1,
      isClosePosition: false,
    }
  }
  createClosePositionOrderRequest(
    position: PositionFutures,
  ): OrderFuturesRequest {
    return {
      type: 'futures',
      symbol: position.symbol,
      side: inverseSide(position.side),
      quantity: position.quantity,
      leverage: position.leverage,
      isClosePosition: true,
    }
  }
}
