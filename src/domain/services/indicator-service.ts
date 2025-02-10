import { Kline } from '../types/kline'
import { IndicatorCreate } from '../models/indicator'

export abstract class IndicatorService {
  constructor(protected readonly periods: number[]) {}
  calculate(symbol: string, klines: Kline[]): IndicatorCreate[] {
    const indicators: IndicatorCreate[] = []

    this.periods.forEach((period: number): void => {
      const value: number = this.getValue(period, klines)

      indicators.push({
        name: this.getName(),
        symbol: symbol,
        period: period,
        value: value,
      })
    })

    return indicators
  }

  abstract getValue(period: number, klines: Kline[]): number
  abstract getName(): string
}
