import { ApiService } from './api-service'
import { InvestmentService } from './investment-service'
import { LeverageService } from './leverage-service'
import { TradingSettings } from '../types/settings'

export class InvestmentFuturesService extends InvestmentService {
  constructor(
    settings: TradingSettings,
    apiService: ApiService,
    private readonly leverageService: LeverageService,
  ) {
    super(settings, apiService)
  }

  async getInvestmentQuantityFromSymbol(symbol: string): Promise<number> {
    const investmentAmount: number = await this.getInvestmentAmount()
    const investmentAmountLeveraged: number =
      this.getInvestmentAmountLeveraged(investmentAmount)
    return this.getQuantityAdjustedFromAmount(symbol, investmentAmountLeveraged)
  }

  private getInvestmentAmountLeveraged(amount: number): number {
    const leverage: number = this.leverageService.getLeverage()
    return this.roundQuantity(amount * leverage)
  }
}
