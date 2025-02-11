import { IndicatorRepository } from '../repositories/indicator-repository'
import { IndicatorEngine } from '../indicators/indicator-engine'
import { Indicator, IndicatorCreate } from '../models/indicator'
import { Kline } from '../types/kline'

export class IndicatorService {
  constructor(
    private readonly indicatorRepository: IndicatorRepository,
    private readonly indicatorEngines: IndicatorEngine[],
  ) {}

  calculate(symbol: string, klines: Kline[]): IndicatorCreate[] {
    const indicators: IndicatorCreate[] = []

    this.indicatorEngines.forEach((indicatorEngine: IndicatorEngine): void => {
      const indicatorCreates: IndicatorCreate[] = indicatorEngine.calculate(
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

  async getLatest(): Promise<Indicator[]> {
    return this.indicatorRepository.getLatest()
  }

  async getLatestForSymbol(symbol: string): Promise<Indicator[]> {
    return this.indicatorRepository.getLatestForSymbol(symbol)
  }
}
