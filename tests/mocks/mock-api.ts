import { Api } from '../../src/application/api'
import { ApiService } from '../../src/domain/services/api-service'
import { settings } from '../../src/application/settings'
import { ApiSettings } from '../../src/domain/types/settings'

export function createMockApi(): jest.Mocked<Api> {
  return {
    getBalance: jest.fn(),
    getSymbol: jest.fn(),
    submitOrder: jest.fn(),
    getOrder: jest.fn(),
    getPosition: jest.fn(),
    getCommissionEquity: jest.fn(),
    getPrice: jest.fn(),
    getKline: jest.fn(),
  } as jest.Mocked<Api>
}

export function createMockApiService(): ApiService {
  const mockApi: jest.Mocked<Api> = createMockApi()
  const mockApiSettings: ApiSettings = settings.api
  return new ApiService(mockApiSettings, mockApi)
}
