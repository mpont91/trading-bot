import { StrategyActionService } from './strategy-action-service'
import { StrategyReportService } from './strategy-report-service'
import { StrategyReport } from '../models/strategy-report'
import { ApiService } from './api-service'
import { Candle } from '../types/candle'
import { Plan } from '../plans/plan'

export class MarketService {
  constructor(
    private readonly strategyActionService: StrategyActionService,
    private readonly strategyReportService: StrategyReportService,
    private readonly apiService: ApiService,
    private readonly plans: Plan[],
  ) {}

  async execute(symbol: string): Promise<void> {
    const plan: Plan | undefined = this.plans.find(
      (p: Plan): boolean => p.getSymbol() === symbol,
    )

    if (!plan) {
      throw new Error(`Plan not found for ${symbol}`)
    }

    const candles: Candle[] = await this.apiService.getCandles(
      symbol,
      plan.getTimeFrame(),
      plan.getCandles(),
    )

    const closedCandles: Candle[] = candles.slice(0, -1)

    const strategyReport: StrategyReport =
      await this.strategyReportService.create(plan.calculate(closedCandles))

    await this.strategyActionService.create(
      this.strategyReportService.calculateStrategyAction(strategyReport),
    )
  }
}
