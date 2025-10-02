import { InvestmentService } from '../../../src/domain/services/investment-service'
import { ApiService } from '../../../src/domain/services/api-service'
import { createMockApiService } from '../../mocks/mock-api'
import { Balance } from '../../../src/domain/types/balance'
import { Symbol } from '../../../src/domain/types/symbol'

let mockApiService: ApiService

function createTestService(
  safetyMargin: number = 0.3,
  maxPositions: number = 1,
): InvestmentService {
  mockApiService = createMockApiService()
  return new InvestmentService(safetyMargin, maxPositions, mockApiService)
}

describe('InvestmentService - calculateInvestmentAmount', (): void => {
  let investmentService: InvestmentService

  test('Should return 70 when having 100 equity with 30% margin and 1 maxOpenPosition', (): void => {
    investmentService = createTestService(0.3, 1)
    const balance: Balance = { equity: 100, available: 100 }

    const result: number = investmentService.calculateInvestmentAmount(balance)

    expect(result).toBe(70)
  })

  test('Should return 35 when having 100 equity with 30% margin and 2 maxOpenPositions', (): void => {
    investmentService = createTestService(0.3, 2)
    const balance: Balance = { equity: 100, available: 100 }

    const result: number = investmentService.calculateInvestmentAmount(balance)

    expect(result).toBe(35)
  })

  test('Should throw error when investment amount exceeds available balance', (): void => {
    investmentService = createTestService()
    const balance: Balance = { equity: 100, available: 20 }

    const calculation = () =>
      investmentService.calculateInvestmentAmount(balance)

    expect(calculation).toThrow(
      'The investment amount calculated exceeds the available balance. Check the open positions and holdings',
    )
  })
})

describe('InvestmentService - calculateAdjustedQuantity', (): void => {
  let investmentService: InvestmentService

  beforeEach((): void => {
    investmentService = createTestService()
  })

  it('Given price: 500, step size 1 and amount to invest: 3000, the quantity should be: 6', (): void => {
    const symbolInfo: Symbol = { name: 'BTCUSDT', price: 500, stepSize: 1 }
    const amount = 3000

    const adjustedQuantity = investmentService.calculateAdjustedQuantity(
      symbolInfo,
      amount,
    )

    expect(adjustedQuantity).toBe(6)
  })

  it('Given price: 200, step size 0.1 and amount to invest: 100, the quantity should be: 0.5', (): void => {
    const symbolInfo: Symbol = { name: 'ETHUSDT', price: 200, stepSize: 0.1 }
    const amount = 100

    const adjustedQuantity = investmentService.calculateAdjustedQuantity(
      symbolInfo,
      amount,
    )

    expect(adjustedQuantity).toBe(0.5)
  })
})

describe('InvestmentService - Orchestrators', (): void => {
  let investmentService: InvestmentService

  beforeEach(() => {
    investmentService = createTestService()
  })

  test('fetchAndCalculateInvestmentAmount should call API and then the calculator', async (): Promise<void> => {
    const balance: Balance = { equity: 100, available: 100 }
    mockApiService.getBalance = jest.fn().mockResolvedValue(balance)

    const calculatorSpy = jest.spyOn(
      investmentService,
      'calculateInvestmentAmount',
    )

    const result = await investmentService.fetchAndCalculateInvestmentAmount()

    expect(mockApiService.getBalance).toHaveBeenCalledTimes(1)
    expect(calculatorSpy).toHaveBeenCalledWith(balance)
    expect(result).toBe(70)
  })

  test('fetchAndCalculateInvestmentQuantity should orchestrate the full flow correctly', async (): Promise<void> => {
    investmentService = createTestService(0.3, 2)
    const balance: Balance = { equity: 1000, available: 1000 }
    const symbolInfo: Symbol = { name: 'BTCUSDT', price: 200, stepSize: 0.1 }
    mockApiService.getBalance = jest.fn().mockResolvedValue(balance)
    mockApiService.getSymbol = jest.fn().mockResolvedValue(symbolInfo)

    const finalQuantity =
      await investmentService.fetchAndCalculateInvestmentQuantity('BTCUSDT')

    expect(mockApiService.getBalance).toHaveBeenCalledTimes(1)
    expect(mockApiService.getSymbol).toHaveBeenCalledWith('BTCUSDT')
    expect(finalQuantity).toBe(1.7)
  })
})
