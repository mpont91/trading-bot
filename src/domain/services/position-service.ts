import { Position, PositionRequest } from '../types/position'
import { ApiService } from './api-service'
import { InvestmentService } from './investment-service'

export class PositionService {
  constructor(
    private readonly apiService: ApiService,
    private readonly investmentService: InvestmentService,
  ) {}

  async getPosition(symbol: string): Promise<Position | null> {
    return this.apiService.getPosition(symbol)
  }
  async openPosition(positionRequest: PositionRequest): Promise<void> {}
  async closePosition(symbol: string): Promise<void> {}
}
