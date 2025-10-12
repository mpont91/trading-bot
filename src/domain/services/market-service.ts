import { StrategyActionService } from './strategy-action-service'
import { StrategyReportService } from './strategy-report-service'
import { Strategy } from '../strategies/strategy'
import { StrategyReport } from '../models/strategy-report'
import { ApiService } from './api-service'
import { Candle, TimeFrame } from '../types/candle'

export class MarketService {
  constructor(
    private readonly strategyActionService: StrategyActionService,
    private readonly strategyReportService: StrategyReportService,
    private readonly strategy: Strategy,
    private readonly apiService: ApiService,
  ) {}

  async execute(symbol: string): Promise<void> {
    const candles: Candle[] = await this.apiService.getCandles(
      symbol,
      TimeFrame['1h'],
      240,
    )
    const strategyReport: StrategyReport =
      await this.strategyReportService.create(
        this.strategy.calculate(symbol, candles),
      )

    await this.strategyActionService.create(
      this.strategyReportService.calculateStrategyAction(strategyReport),
    )
  }
}
