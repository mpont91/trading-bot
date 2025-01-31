import { InvestmentService } from '../../../src/domain/services/investment-service'
import { TradingSettings } from '../../../src/application/settings'
import { ApiService } from '../../../src/domain/services/api-service'
import { Api } from '../../../src/application/api/api'

describe('InvestmentService', (): void => {
  let mockApi: jest.Mocked<Api>
  let mockApiService: ApiService
  let mockSettings: TradingSettings
  let investmentService: InvestmentService

  beforeEach((): void => {
    mockApi = {
      getBalance: jest.fn().mockResolvedValue({ equity: 100, available: 100 }),
      getStepSize: jest.fn(),
    } as jest.Mocked<Api>

    mockApiService = new ApiService(mockApi)

    mockSettings = {
      safetyCapitalMargin: 0.3,
      symbols: ['BTCUSDT'],
    }

    investmentService = new InvestmentService(mockSettings, mockApiService)
  })

  test('Should return 30 when having 100 available with 30% margin and 1 symbol to invest', async (): Promise<void> => {
    const result: number = await investmentService.getInvestmentAmount()
    expect(result).toBe(70)
  })

  test('Should return 35 when having 100 equity with 30% margin and 2 symbols to invest', async (): Promise<void> => {
    mockSettings.symbols = ['BTCUSDT', 'ETHUSDT']

    const result: number = await investmentService.getInvestmentAmount()
    expect(result).toBe(35)
  })

  test('Should throw error when there are no symbols to invest', async (): Promise<void> => {
    mockSettings.symbols = []

    await expect(investmentService.getInvestmentAmount()).rejects.toThrow(
      'There are no symbols to invest.',
    )
  })

  test('Should throw error when investment amount exceeds available balance', async (): Promise<void> => {
    mockApi.getBalance = jest
      .fn()
      .mockResolvedValue({ equity: 100, available: 20 })

    await expect(investmentService.getInvestmentAmount()).rejects.toThrow(
      'The investment amount calculated exceeds the available balance. Check the open positions and holdings',
    )
  })
})
