import { PositionService } from './position-service'
import { OrderSpotRequest } from '../models/order'
import { inverseSide } from '../helpers/side-helper'
import { Position } from '../types/position'
import { Side } from '../types/side'

export class PositionSpotService extends PositionService {
  createOpenPositionOrderRequest(
    symbol: string,
    quantity: number,
    side: Side,
  ): OrderSpotRequest {
    return {
      symbol: symbol,
      side: side,
      quantity: quantity,
    }
  }
  createClosePositionOrderRequest(position: Position): OrderSpotRequest {
    return {
      symbol: position.symbol,
      side: inverseSide(position.side),
      quantity: position.quantity,
    }
  }
}
