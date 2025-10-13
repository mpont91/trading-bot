import { StrategyActionService } from './strategy-action-service'
import { StrategyReportService } from './strategy-report-service'
import { Strategy } from '../strategies/strategy'
import { StrategyReport } from '../models/strategy-report'
import { ApiService } from './api-service'
import { Candle } from '../types/candle'

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
      this.strategy.getTimeFrame(),
      this.strategy.getCandles(),
    )

    const closedCandles: Candle[] = candles.slice(0, -1)

    const strategyReport: StrategyReport =
      await this.strategyReportService.create(
        this.strategy.calculate(symbol, closedCandles),
      )

    await this.strategyActionService.create(
      this.strategyReportService.calculateStrategyAction(strategyReport),
    )
  }
}
