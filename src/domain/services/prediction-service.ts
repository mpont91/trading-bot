import { IndicatorRepository } from '../repositories/indicator-repository'
import { IndicatorService } from './indicator-service'
import { IndicatorCreate } from '../models/indicator'
import { Kline } from '../types/kline'

export class PredictionService {
  constructor(
    private readonly indicatorRepository: IndicatorRepository,
    private readonly indicators: IndicatorService[],
  ) {}

  calculateIndicators(symbol: string, klines: Kline[]): IndicatorCreate[] {
    const indicators: IndicatorCreate[] = []

    this.indicators.forEach((indicatorService: IndicatorService): void => {
      const indicator: IndicatorCreate[] = indicatorService.calculate(
        symbol,
        klines,
      )

      indicators.push(...indicator)
    })

    return indicators
  }

  async storeIndicators(indicators: IndicatorCreate[]): Promise<void> {
    await this.indicatorRepository.createMany(indicators)
  }
}
