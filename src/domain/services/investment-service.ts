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

  async getInvestmentQuantity(symbol: string): Promise<number> {
    const investment: number = await this.getInvestmentAmount()
    return this.getQuantityAdjusted(symbol, investment)
  }

  async getInvestmentAmount(): Promise<number> {
    const balance: Balance = await this.apiService.getBalance()
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

  async getQuantityAdjusted(symbol: string, amount: number): Promise<number> {
    const symbolInformation: Symbol = await this.apiService.getSymbol(symbol)

    const quantity: number = amount / symbolInformation.price
    const adjustedQuantity: number = adjustQuantity(
      quantity,
      symbolInformation.stepSize,
    )

    if (adjustedQuantity <= 0) {
      throw new Error(`Calculated quantity is too small for ${symbol}.`)
    }

    return roundQuantity(adjustedQuantity)
  }
}
