import { ApiService } from './api-service'
import { Balance } from '../types/balance'
import { Symbol } from '../types/symbol'
import { TradingSettings } from '../types/settings'

export class InvestmentService {
  constructor(
    private readonly settings: TradingSettings,
    private readonly apiService: ApiService,
  ) {}

  async getInvestmentQuantityFromSymbol(symbol: string): Promise<number> {
    const investmentAmount: number = await this.getInvestmentAmount()
    return this.getQuantityAdjustedFromAmount(symbol, investmentAmount)
  }

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

    return this.roundQuantity(totalInvestmentForSymbol)
  }

  async getQuantityAdjustedFromAmount(
    symbol: string,
    amount: number,
  ): Promise<number> {
    const symbolInformation: Symbol = await this.apiService.getSymbol(symbol)

    const quantity: number = amount / symbolInformation.price
    const adjustedQuantity: number =
      Math.floor(quantity / symbolInformation.stepSize) *
      symbolInformation.stepSize

    if (adjustedQuantity <= 0) {
      throw new Error(`Calculated quantity is too small for ${symbol}.`)
    }

    return this.roundQuantity(adjustedQuantity)
  }

  private roundQuantity(number: number): number {
    return Math.round(number * 1e6) / 1e6
  }
}
