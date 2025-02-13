import { BinanceApi } from '../../src/application/api/binance-api'
import { BitmartApi } from '../../src/application/api/bitmart-api'
import { ApiSpotService } from '../../src/domain/services/api-spot-service'
import { ApiService } from '../../src/domain/services/api-service'
import { ApiFuturesService } from '../../src/domain/services/api-futures-service'
import { settings } from '../../src/application/settings'
import { ApiSettings } from '../../src/domain/types/settings'

export function createMockBinanceApi(): jest.Mocked<BinanceApi> {
  return {
    getBalance: jest.fn(),
    getSymbol: jest.fn(),
    submitOrder: jest.fn(),
    getOrder: jest.fn(),
    getPosition: jest.fn(),
    getCommissionEquity: jest.fn(),
    getPrice: jest.fn(),
    getKline: jest.fn(),
  } as jest.Mocked<BinanceApi>
}

export function createMockBitmartApi(): jest.Mocked<BitmartApi> {
  return {
    getBalance: jest.fn(),
    getSymbol: jest.fn(),
    submitOrder: jest.fn(),
    getOrder: jest.fn(),
    getPosition: jest.fn(),
    setLeverage: jest.fn(),
  } as jest.Mocked<BitmartApi>
}

export function createMockApiSpotService(): ApiService {
  const mockBinanceApi: jest.Mocked<BinanceApi> = createMockBinanceApi()
  const mockApiSettings: ApiSettings = settings.api
  return new ApiSpotService(mockApiSettings, mockBinanceApi)
}

export function createMockApiFuturesService(): ApiService {
  const mockBitmartApi: jest.Mocked<BitmartApi> = createMockBitmartApi()
  return new ApiFuturesService(mockBitmartApi)
}
