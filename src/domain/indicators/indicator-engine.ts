import { Kline } from '../types/kline'
import { IndicatorCreate } from '../models/indicator'

export abstract class IndicatorEngine {
  constructor(protected readonly periods: number[]) {}
  calculate(symbol: string, klines: Kline[]): IndicatorCreate[] {
    const indicators: IndicatorCreate[] = []

    if (klines.length === 0) {
      console.warn('There is no klines. Skipping calculation')
    }

    this.periods.forEach((period: number): void => {
      const value: number = this.getValue(period, klines)

      indicators.push({
        name: this.getName(),
        symbol: symbol,
        period: period,
        value: value,
        price: klines[klines.length - 1].closePrice,
      })
    })

    return indicators
  }

  abstract getValue(period: number, klines: Kline[]): number
  abstract getName(): string
}
