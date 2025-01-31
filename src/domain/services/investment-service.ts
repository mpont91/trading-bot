import { ApiService } from './api-service'
import { Balance } from '../types/balance'
import { TradingSettings } from '../../application/settings'

export class InvestmentService {
  constructor(
    private readonly settings: TradingSettings,
    private readonly apiService: ApiService,
  ) {}

  async getInvestmentAmount(): Promise<number> {
    const balance: Balance = await this.apiService.getBalance()
    const total: number = balance.equity
    const margin: number = total * this.settings.safetyCapitalMargin
    const totalInvestment: number = total - margin

    const symbols: string[] = this.settings.symbols

    if (symbols.length === 0) {
      throw new Error('There are no symbols to invest.')
    }

    const totalInvestmentForSymbol: number = totalInvestment / symbols.length

    if (totalInvestmentForSymbol > balance.available) {
      throw new Error(
        'The investment amount calculated exceeds the available balance. Check the open positions and holdings',
      )
    }

    return totalInvestmentForSymbol
  }
}
