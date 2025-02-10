import { IndicatorRepository } from '../repositories/indicator-repository'
import { Indicator } from '../indicators/indicator'
import { IndicatorCreate } from '../models/indicator'
import { Kline } from '../types/kline'

export class IndicatorService {
  constructor(
    private readonly indicatorRepository: IndicatorRepository,
    private readonly indicators: Indicator[],
  ) {}

  calculate(symbol: string, klines: Kline[]): IndicatorCreate[] {
    const indicators: IndicatorCreate[] = []

    this.indicators.forEach((indicator: Indicator): void => {
      const indicatorCreates: IndicatorCreate[] = indicator.calculate(
        symbol,
        klines,
      )

      indicators.push(...indicatorCreates)
    })

    return indicators
  }

  async store(indicators: IndicatorCreate[]): Promise<void> {
    await this.indicatorRepository.createMany(indicators)
  }
}
