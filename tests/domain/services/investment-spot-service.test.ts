import { InvestmentService } from '../../../src/domain/services/investment-service'
import { ApiService } from '../../../src/domain/services/api-service'
import { InvestmentSpotService } from '../../../src/domain/services/investment-spot-service'
import { createMockApiSpotService } from '../../mocks/mock-api'
import { TradingSettings } from '../../../src/domain/types/settings'

let mockApiService: ApiService
let mockTradingSettings: TradingSettings
let investmentService: InvestmentService

function initialize(): void {
  mockApiService = createMockApiSpotService()

  mockApiService.getBalance = jest
    .fn()
    .mockResolvedValue({ equity: 100, available: 100 })

  mockTradingSettings = {
    safetyCapitalMargin: 0.3,
    symbols: ['BTCUSDT'],
  }

  investmentService = new InvestmentSpotService(
    mockTradingSettings,
    mockApiService,
  )
}
describe('InvestmentService - getInvestmentAmount', (): void => {
  beforeEach((): void => {
    initialize()
  })

  test('Should return 30 when having 100 available with 30% margin and 1 symbol to invest', async (): Promise<void> => {
    const result: number = await investmentService.getInvestmentAmount()
    expect(result).toBe(70)
  })

  test('Should return 35 when having 100 equity with 30% margin and 2 symbols to invest', async (): Promise<void> => {
    mockTradingSettings.symbols = ['BTCUSDT', 'ETHUSDT']

    const result: number = await investmentService.getInvestmentAmount()
    expect(result).toBe(35)
  })

  test('Should throw error when there are no symbols to invest', async (): Promise<void> => {
    mockTradingSettings.symbols = []

    await expect(investmentService.getInvestmentAmount()).rejects.toThrow(
      'There are no symbols to invest.',
    )
  })

  test('Should throw error when investment amount exceeds available balance', async (): Promise<void> => {
    mockApiService.getBalance = jest
      .fn()
      .mockResolvedValue({ equity: 100, available: 20 })

    await expect(investmentService.getInvestmentAmount()).rejects.toThrow(
      'The investment amount calculated exceeds the available balance. Check the open positions and holdings',
    )
  })
})

describe('InvestmentService - getQuantityAdjustedFromAmount', (): void => {
  beforeEach((): void => {
    initialize()
  })

  it('Given price: 500, step size 1 and amount to invest: 3000, the quantity should be: 6', async (): Promise<void> => {
    mockApiService.getSymbol = jest.fn().mockResolvedValue({
      price: 500,
      stepSize: 1,
    })

    const symbol: string = 'BTCUSDT'
    const amount: number = 3000

    const adjustedQuantity: number =
      await investmentService.getQuantityAdjustedFromAmount(symbol, amount)

    expect(adjustedQuantity).toBe(6)
  })

  it('Given price: 200, step size 0.1 and amount to invest: 100, the quantity should be: 0.5', async (): Promise<void> => {
    mockApiService.getSymbol = jest.fn().mockResolvedValue({
      price: 200,
      stepSize: 0.1,
    })

    const symbol: string = 'BTCUSDT'
    const amount: number = 100

    const adjustedQuantity: number =
      await investmentService.getQuantityAdjustedFromAmount(symbol, amount)

    expect(adjustedQuantity).toBe(0.5)
  })

  it('Given price: 100000, step size 0.01 and amount to invest: 25000, the quantity should be: 0.25', async (): Promise<void> => {
    mockApiService.getSymbol = jest.fn().mockResolvedValue({
      price: 100000,
      stepSize: 0.01,
    })

    const symbol: string = 'BTCUSDT'
    const amount: number = 25000

    const adjustedQuantity: number =
      await investmentService.getQuantityAdjustedFromAmount(symbol, amount)

    expect(adjustedQuantity).toBe(0.25)
  })
})
