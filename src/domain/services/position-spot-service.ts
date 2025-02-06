import { PositionService } from './position-service'
import { OrderSpotRequest } from '../models/order'
import { inverseSide } from '../helpers/side-helper'
import { Position } from '../types/position'

export class PositionSpotService extends PositionService {
  createOpenPositionOrderRequest(
    symbol: string,
    quantity: number,
  ): OrderSpotRequest {
    return {
      type: 'spot',
      symbol: symbol,
      side: 'long',
      quantity: quantity,
    }
  }
  createClosePositionOrderRequest(position: Position): OrderSpotRequest {
    return {
      type: 'spot',
      symbol: position.symbol,
      side: inverseSide(position.side),
      quantity: position.quantity,
    }
  }
}
