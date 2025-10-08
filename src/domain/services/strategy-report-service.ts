import { Signal } from '../types/signal'
import { StrategyActionCreate } from '../models/strategy-action'
import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'
import { StrategyReportRepository } from '../repositories/strategy-report-repository'

export class StrategyReportService {
  constructor(
    private readonly strategyReportRepository: StrategyReportRepository,
  ) {}

  async create(strategyReport: StrategyReportCreate): Promise<StrategyReport> {
    return this.strategyReportRepository.create(strategyReport)
  }

  calculateStrategyAction(
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
