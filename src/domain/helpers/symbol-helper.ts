import { settings } from '../../application/settings'

const spotBaseCurrency: string = settings.binance.baseCurrency
const futuresBaseCurrency: string = settings.bitmart.baseCurrency

export function isSymbolForSpotBaseCurrency(symbol: string): boolean {
  return symbol.includes(spotBaseCurrency)
}

export function isSymbolForFuturesBaseCurrency(symbol: string): boolean {
  return symbol.includes(futuresBaseCurrency)
}

export function convertSymbolToSpotBaseCurrency(symbol: string): string {
  return symbol.replace(futuresBaseCurrency, spotBaseCurrency)
}

export function convertSymbolToFuturesBaseCurrency(symbol: string): string {
  return symbol.replace(spotBaseCurrency, futuresBaseCurrency)
}
