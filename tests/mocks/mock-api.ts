import { Api } from '../../src/application/api'
import { ApiService } from '../../src/domain/services/api-service'

export function createMockApi(): jest.Mocked<Api> {
  return {
    getCoins: jest.fn(),
    getEquity: jest.fn(),
    getCommissionEquity: jest.fn(),
    getBalance: jest.fn(),
    getSymbol: jest.fn(),
    submitOrder: jest.fn(),
    getOrder: jest.fn(),
    getPrice: jest.fn(),
    getCandles: jest.fn(),
  } as jest.Mocked<Api>
}

export function createMockApiService(): ApiService {
  const mockApi: jest.Mocked<Api> = createMockApi()
  return new ApiService(mockApi)
}
