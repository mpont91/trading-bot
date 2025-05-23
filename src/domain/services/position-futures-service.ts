import { PositionService } from './position-service'
import { OrderFuturesRequest } from '../models/order'
import { PositionFutures } from '../types/position'
import { inverseSide } from '../helpers/side-helper'
import { ApiService } from './api-service'
import { InvestmentService } from './investment-service'
import { OrderService } from './order-service'
import { LeverageService } from './leverage-service'
import { TradeService } from './trade-service'
import { Side } from '../types/side'
import { TrailingService } from './trailing-service'

export class PositionFuturesService extends PositionService {
  constructor(
    apiService: ApiService,
    investmentService: InvestmentService,
    orderService: OrderService,
    tradeService: TradeService,
    trailingService: TrailingService,
    private readonly leverageService: LeverageService,
  ) {
    super(
      apiService,
      investmentService,
      orderService,
      tradeService,
      trailingService,
    )
  }

  createOpenPositionOrderRequest(
    symbol: string,
    quantity: number,
    side: Side,
  ): OrderFuturesRequest {
    const leverage: number = this.leverageService.getLeverage()
    return {
      symbol: symbol,
      side: side,
      quantity: quantity,
      leverage: leverage,
      isClosePosition: false,
    }
  }
  createClosePositionOrderRequest(
    position: PositionFutures,
  ): OrderFuturesRequest {
    return {
      symbol: position.symbol,
      side: inverseSide(position.side),
      quantity: position.quantity,
      leverage: position.leverage,
      isClosePosition: true,
    }
  }
}
