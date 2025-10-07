import { Signal } from '../types/signal'
import { StrategyActionCreate } from '../models/strategy-action'
import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { IndicatorService } from './indicator-service'
import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'
import { Strategy } from '../strategies/strategy'
import { StrategyReportRepository } from '../repositories/strategy-report-repository'

export class StrategyReportService {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly strategyReportRepository: StrategyReportRepository,
    private readonly strategy: Strategy,
  ) {}

  async fetchAndCalculate(symbol: string): Promise<StrategyActionCreate> {
    const indicators: IndicatorList | null =
      await this.indicatorService.getAll(symbol)

    if (!indicators) {
      throw new Error(
        `There are no indicators for this symbol to evaluate a decision! Symbol: ${symbol}`,
      )
    }

    const strategyReport: StrategyReportCreate =
      this.strategy.calculate(indicators)
    await this.strategyReportRepository.create(strategyReport)
    return this.calculate(strategyReport)
  }

  evaluate(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyReport | StrategyReportCreate {
    return this.strategy.calculate(indicators)
  }

  calculate(
    strategyReport: StrategyReport | StrategyReportCreate,
  ): StrategyActionCreate {
    if (strategyReport.shouldBuy && strategyReport.shouldSell) {
      throw new Error(
        'Strategy report evaluated should buy and sell at the same time. Something is broken!',
      )
    }

    let signal: Signal = Signal.HOLD

    if (strategyReport.shouldBuy) {
      signal = Signal.BUY
    }

    if (strategyReport.shouldSell) {
      signal = Signal.SELL
    }

    return {
      symbol: strategyReport.symbol,
      signal,
      price: strategyReport.price,
      tp: strategyReport.tp,
      sl: strategyReport.sl,
      ts: strategyReport.ts,
      tpPrice: strategyReport.tpPrice,
      slPrice: strategyReport.slPrice,
    }
  }
}
