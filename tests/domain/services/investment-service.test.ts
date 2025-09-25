import { InvestmentService } from '../../../src/domain/services/investment-service'
import { ApiService } from '../../../src/domain/services/api-service'
import { createMockApiService } from '../../mocks/mock-api'

let mockApiService: ApiService
let investmentService: InvestmentService

function createTestService(
  params: {
    safetyMargin?: number
    maxPositions?: number
    balance?: { equity: number; available: number }
    symbol?: { price: number; stepSize: number }
  } = {},
): InvestmentService {
  const defaultBalance = { equity: 100, available: 100 }
  const defaultSymbol = { price: 500, stepSize: 1 }
  const safetyMargin = params.safetyMargin ?? 0.3
  const maxPositions = params.maxPositions ?? 1
  const balance = params.balance ?? defaultBalance
  const symbol = params.symbol ?? defaultSymbol

  mockApiService = createMockApiService()
  mockApiService.getBalance = jest.fn().mockResolvedValue(balance)
  mockApiService.getSymbol = jest.fn().mockResolvedValue(symbol)

  return new InvestmentService(safetyMargin, maxPositions, mockApiService)
}

describe('InvestmentService - getInvestmentAmount', (): void => {
  beforeEach((): void => {
    investmentService = createTestService()
  })

  test('Should return 30 when having 100 available with 30% margin and 1 maxOpenPosition setting', async (): Promise<void> => {
    const result: number = await investmentService.getInvestmentAmount()
    expect(result).toBe(70)
  })

  test('Should return 35 when having 100 equity with 30% margin and 2 maxOpenPosition setting', async (): Promise<void> => {
    investmentService = createTestService({ maxPositions: 2 })

    const result: number = await investmentService.getInvestmentAmount()
    expect(result).toBe(35)
  })

  test('Should throw error when investment amount exceeds available balance', async (): Promise<void> => {
    investmentService = createTestService({
      balance: { equity: 100, available: 20 },
    })

    await expect(investmentService.getInvestmentAmount()).rejects.toThrow(
      'The investment amount calculated exceeds the available balance. Check the open positions and holdings',
    )
  })
})

describe('InvestmentService - getQuantityAdjustedFromAmount', (): void => {
  beforeEach((): void => {
    investmentService = createTestService()
  })

  it('Given price: 500, step size 1 and amount to invest: 3000, the quantity should be: 6', async (): Promise<void> => {
    const symbol: string = 'BTCUSDT'
    const amount: number = 3000

    const adjustedQuantity: number =
      await investmentService.getQuantityAdjusted(symbol, amount)

    expect(adjustedQuantity).toBe(6)
  })

  it('Given price: 200, step size 0.1 and amount to invest: 100, the quantity should be: 0.5', async (): Promise<void> => {
    investmentService = createTestService({
      symbol: { price: 200, stepSize: 0.1 },
    })

    const symbol: string = 'BTCUSDT'
    const amount: number = 100

    const adjustedQuantity: number =
      await investmentService.getQuantityAdjusted(symbol, amount)

    expect(adjustedQuantity).toBe(0.5)
  })

  it('Given price: 100000, step size 0.01 and amount to invest: 25000, the quantity should be: 0.25', async (): Promise<void> => {
    investmentService = createTestService({
      symbol: { price: 100000, stepSize: 0.01 },
    })

    const symbol: string = 'BTCUSDT'
    const amount: number = 25000

    const adjustedQuantity: number =
      await investmentService.getQuantityAdjusted(symbol, amount)

    expect(adjustedQuantity).toBe(0.25)
  })
})
