import { StrategyActionService } from './strategy-action-service'
import { StrategyReportService } from './strategy-report-service'
import { StrategyReport } from '../models/strategy-report'
import { ApiService } from './api-service'
import { Candle } from '../types/candle'
import { Strategy } from '../strategies/strategy'

export class MarketService {
  constructor(
    private readonly strategyActionService: StrategyActionService,
    private readonly strategyReportService: StrategyReportService,
    private readonly apiService: ApiService,
    private readonly strategies: Strategy[],
  ) {}

  async execute(symbol: string): Promise<void> {
    const strategy: Strategy | undefined = this.strategies.find(
      (s: Strategy): boolean => s.getSymbol() === symbol,
    )

    if (!strategy) {
      throw new Error(`Strategy not found for ${symbol}`)
    }

    const candles: Candle[] = await this.apiService.getCandles(
      symbol,
      strategy.getTimeFrame(),
      strategy.getCandles(),
    )

    const closedCandles: Candle[] = candles.slice(0, -1)

    const strategyReport: StrategyReport =
      await this.strategyReportService.create(strategy.calculate(closedCandles))

    await this.strategyActionService.create(
      this.strategyReportService.calculateStrategyAction(strategyReport),
    )
  }
}
