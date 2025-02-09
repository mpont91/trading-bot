import { BinanceApi } from '../../src/application/api/binance-api'

export function mockApi(): jest.Mocked<BinanceApi> {
  return {
    getBalance: jest.fn().mockResolvedValue({ equity: 100, available: 100 }),
    getSymbol: jest.fn(),
    submitOrder: jest.fn(),
    getOrder: jest.fn(),
    getPosition: jest.fn(),
    getCommissionEquity: jest.fn(),
    getPrice: jest.fn(),
    getKline: jest.fn(),
  } as jest.Mocked<BinanceApi>
}
