import { Signal } from '../types/signal'
import { Stops, StrategyCreate } from '../models/strategy'
import { IndicatorList } from '../models/indicator'
import { IndicatorService } from './indicator-service'
import { median } from '../helpers/math-helper'
import { RiskService } from './risk-service'

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

    const { bb, sma, rsi, atr, adx, smaCross } = indicators

    const price: number = median([
      bb.price,
      sma.price,
      rsi.price,
      atr.price,
      adx.price,
      smaCross.price,
    ])

    const strategy: StrategyCreate = {
      symbol,
      signal: Signal.HOLD,
      price,
      tp: undefined,
      sl: undefined,
      ts: undefined,
      tpPrice: undefined,
      slPrice: undefined,
    }

    if (this.riskService.shouldBuy(indicators)) {
      const stops: Stops | null = this.riskService.stops(indicators)
      if (stops) {
        strategy.signal = Signal.BUY
        strategy.tp = stops.tp
        strategy.sl = stops.sl
        strategy.ts = stops.ts
        strategy.tpPrice = stops.tpPrice
        strategy.slPrice = stops.slPrice
      }
    } else if (this.riskService.shouldSell(indicators)) {
      strategy.signal = Signal.SELL
    }

    return strategy
  }
}
