import { PositionService } from './position-service'
import { OrderFuturesRequest } from '../models/order'
import { PositionFutures } from '../types/position'
import { inverseSide } from '../helpers/side-helper'
import { ApiService } from './api-service'
import { InvestmentService } from './investment-service'
import { OrderService } from './order-service'
import { LeverageService } from './leverage-service'
import { TradeService } from './trade-service'

export class PositionFuturesService extends PositionService {
  constructor(
    apiService: ApiService,
    investmentService: InvestmentService,
    orderService: OrderService,
    tradeService: TradeService,
    private readonly leverageService: LeverageService,
  ) {
    super(apiService, investmentService, orderService, tradeService)
  }

  createOpenPositionOrderRequest(
    symbol: string,
    quantity: number,
  ): OrderFuturesRequest {
    const leverage: number = this.leverageService.getLeverage()
    return {
      type: 'futures',
      symbol: symbol,
      side: 'long',
      quantity: quantity,
      leverage: leverage,
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
