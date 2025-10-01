import { Signal } from '../types/signal'
import { StrategyCreate } from '../models/strategy'
import { IndicatorList } from '../models/indicator'
import { IndicatorService } from './indicator-service'
import { RiskService } from './risk-service'
import { Risk } from '../models/risk'

export class DecisionService {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly riskService: RiskService,
  ) {}

  async evaluate(symbol: string): Promise<StrategyCreate> {
    const indicators: IndicatorList | null =
      await this.indicatorService.getAll(symbol)

    if (!indicators) {
      throw new Error(
        `There are no indicators for this symbol to evaluate a decision! Symbol: ${symbol}`,
      )
    }

    const risk: Risk = await this.riskService.store(indicators)

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
      symbol,
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
