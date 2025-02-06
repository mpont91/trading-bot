import { Position } from '../types/position'
import { ApiService } from './api-service'
import { InvestmentService } from './investment-service'
import { OrderRequest } from '../models/order'

export abstract class PositionService {
  constructor(
    protected readonly apiService: ApiService,
    protected readonly investmentService: InvestmentService,
  ) {}

  async getPosition(symbol: string): Promise<Position | null> {
    return this.apiService.getPosition(symbol)
  }

  async openPosition(symbol: string): Promise<void> {
    const investmentAmount: number =
      await this.investmentService.getInvestmentAmount()
    const investmentQuantity: number =
      await this.investmentService.getQuantityAdjustedFromAmount(
        symbol,
        investmentAmount,
      )

    const orderRequest: OrderRequest = this.createOpenPositionOrderRequest(
      symbol,
      investmentQuantity,
    )

    await this.apiService.submitOrder(orderRequest)
  }

  async closePosition(symbol: string): Promise<void> {
    const position: Position | null = await this.getPosition(symbol)
    if (!position) {
      throw Error('Tried to close a position when there is no open position!')
    }

    const orderRequest: OrderRequest =
      this.createClosePositionOrderRequest(position)

    await this.apiService.submitOrder(orderRequest)
  }

  abstract createOpenPositionOrderRequest(
    symbol: string,
    quantity: number,
  ): OrderRequest
  abstract createClosePositionOrderRequest(position: Position): OrderRequest
}
