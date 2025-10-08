import { IndicatorService } from './indicator-service'
import { IndicatorList } from '../models/indicator'
import { StrategyActionService } from './strategy-action-service'
import { StrategyReportService } from './strategy-report-service'
import { Strategy } from '../strategies/strategy'
import { StrategyReport } from '../models/strategy-report'
import { TimeFrame } from '../types/candle'

export class MarketService {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly strategyActionService: StrategyActionService,
    private readonly strategyReportService: StrategyReportService,
    private readonly strategy: Strategy,
  ) {}

  async execute(symbol: string): Promise<void> {
    const timeFrame: TimeFrame = this.strategy.getTimeFrame()
    const candles: number = this.strategy.getCandles()

    const indicators: IndicatorList =
      await this.indicatorService.fetchAndCalculateAndCreateAll(
        symbol,
        timeFrame,
        candles,
      )

    const strategyReport: StrategyReport =
      await this.strategyReportService.create(
        this.strategy.calculate(indicators),
      )

    await this.strategyActionService.create(
      this.strategyReportService.calculateStrategyAction(strategyReport),
    )
  }
}
