import {
  convertSymbolToFuturesBaseCurrency,
  convertSymbolToSpotBaseCurrency,
} from '../../../src/domain/helpers/symbol-helper'

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
