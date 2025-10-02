import { ApiService } from './api-service'
import { Balance } from '../types/balance'
import { Symbol } from '../types/symbol'
import { adjustQuantity, roundQuantity } from '../helpers/math-helper'

export class InvestmentService {
  constructor(
    private readonly safetyCapitalMargin: number,
    private readonly maxPositionsOpened: number,
    private readonly apiService: ApiService,
  ) {}

  async fetchAndCalculateInvestmentQuantity(symbol: string): Promise<number> {
    const balance = await this.apiService.getBalance()
    const symbolInformation: Symbol = await this.apiService.getSymbol(symbol)

    const investmentAmount: number = this.calculateInvestmentAmount(balance)
    return this.calculateAdjustedQuantity(symbolInformation, investmentAmount)
  }

  async fetchAndCalculateInvestmentAmount(): Promise<number> {
    const balance: Balance = await this.apiService.getBalance()
    return this.calculateInvestmentAmount(balance)
  }

  calculateInvestmentAmount(balance: Balance): number {
    const margin: number = balance.equity * this.safetyCapitalMargin
    const total: number = balance.equity - margin
    const investment: number = total / this.maxPositionsOpened

    if (investment > balance.available) {
      throw new Error(
        'The investment amount calculated exceeds the available balance. Check the open positions and holdings',
      )
    }

    return roundQuantity(investment)
  }

  calculateAdjustedQuantity(symbol: Symbol, amount: number): number {
    const quantity: number = amount / symbol.price
    const adjustedQuantity: number = adjustQuantity(quantity, symbol.stepSize)

    if (adjustedQuantity <= 0) {
      throw new Error(`Calculated quantity is too small for ${symbol.name}.`)
    }

    return roundQuantity(adjustedQuantity)
  }
}
