import { Signal } from '../types/signal'
import { StrategyActionCreate } from '../models/strategy-action'
import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { IndicatorService } from './indicator-service'
import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'
import { Strategy } from '../strategies/strategy'

export class StrategyReportService {
  constructor(
    private readonly indicatorService: IndicatorService,
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

    const risk: StrategyReport =
      await this.strategy.calculateAndCreate(indicators)
    return this.calculate(risk)
  }

  evaluate(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyReport | StrategyReportCreate {
    return this.strategy.calculate(indicators)
  }

  calculate(risk: StrategyReport | StrategyReportCreate): StrategyActionCreate {
    if (risk.shouldBuy && risk.shouldSell) {
      throw new Error(
        'Risk evaluated should buy and sell at the same time. Something is broken!',
      )
    }

    let signal: Signal = Signal.HOLD

    if (risk.shouldBuy) {
      signal = Signal.BUY
    }

    if (risk.shouldSell) {
      signal = Signal.SELL
    }

    return {
      symbol: risk.symbol,
      signal,
      price: risk.price,
      tp: risk.tp,
      sl: risk.sl,
      ts: risk.ts,
      tpPrice: risk.tpPrice,
      slPrice: risk.slPrice,
    }
  }
}
