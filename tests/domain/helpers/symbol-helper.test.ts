import {
  convertSymbolToFuturesBaseCurrency,
  convertSymbolToSpotBaseCurrency,
  isSymbolForFuturesBaseCurrency,
  isSymbolForSpotBaseCurrency,
} from '../../../src/domain/helpers/symbol-helper'

describe('SymbolHelper - isSymbolForSpotBaseCurrency', (): void => {
  test('Should return true with symbol which ends with USDC', async (): Promise<void> => {
    expect(isSymbolForSpotBaseCurrency('BTCUSDC')).toBe(true)
  })

  test('Should return false with different base currency', async (): Promise<void> => {
    expect(isSymbolForSpotBaseCurrency('XRPBTC')).toBe(false)
  })

  test('Should return false with different base currency', async (): Promise<void> => {
    expect(isSymbolForSpotBaseCurrency('XRPUSDT')).toBe(false)
  })
})

describe('SymbolHelper - isSymbolForFuturesBaseCurrency', (): void => {
  test('Should return true with symbol which ends with USDT', async (): Promise<void> => {
    expect(isSymbolForFuturesBaseCurrency('BTCUSDT')).toBe(true)
  })

  test('Should return false with different base currency', async (): Promise<void> => {
    expect(isSymbolForFuturesBaseCurrency('XRPBTC')).toBe(false)
  })

  test('Should return false with different base currency', async (): Promise<void> => {
    expect(isSymbolForFuturesBaseCurrency('XRPUSDC')).toBe(false)
  })
})

describe('SymbolHelper - convertSymbolToSpotBaseCurrency', (): void => {
  test('Should BTCUSDT be converted to BTCUSDC', async (): Promise<void> => {
    const symbol: string = 'BTCUSDC'
    const symbolConverted: string = convertSymbolToSpotBaseCurrency(symbol)
    const symbolExpected: string = 'BTCUSDC'
    expect(symbolConverted).toBe(symbolExpected)
  })

  test('Symbols with different base currencies should not affect', async (): Promise<void> => {
    const symbol: string = 'XRPBTC'
    const symbolConverted: string = convertSymbolToSpotBaseCurrency(symbol)
    expect(symbolConverted).toBe(symbol)
  })
})

describe('SymbolHelper - convertSymbolToFuturesBaseCurrency', (): void => {
  test('Should BTCUSDC be converted to BTCUSDT', async (): Promise<void> => {
    const symbol: string = 'BTCUSDC'
    const symbolConverted: string = convertSymbolToFuturesBaseCurrency(symbol)
    const symbolExpected: string = 'BTCUSDT'
    expect(symbolConverted).toBe(symbolExpected)
  })

  test('Symbols with different base currencies should not affect', async (): Promise<void> => {
    const symbol: string = 'XRPBTC'
    const symbolConverted: string = convertSymbolToFuturesBaseCurrency(symbol)
    expect(symbolConverted).toBe(symbol)
  })
})
