import { IndicatorCreate } from '../models/indicator'
import { StrategyCreate } from '../models/strategy'
import { Side } from '../types/side'
import {
  IndicatorConditionRuleSettings,
  IndicatorLeverageRuleSettings,
  IndicatorSideRuleSettings,
  IndicatorsRulesSettings,
} from '../types/settings'

export class PredictionService {
  constructor(private settings: IndicatorsRulesSettings) {}

  async predict(indicators: IndicatorCreate[]): Promise<StrategyCreate> {
    const lastPrice: number = indicators[0].price!
    const symbol: string = indicators[0].symbol!

    let side: Side = this.evaluateSide(indicators)

    let sl: number | undefined
    let tp: number | undefined
    let leverage: number | undefined

    if (side !== 'hold') {
      tp = this.evaluateTakeProfit(indicators, lastPrice, side)
      if (!tp) {
        side = 'hold'
        tp = undefined
        sl = undefined
        leverage = undefined
      } else {
        sl = this.evaluateStopLoss(indicators, lastPrice, side)
        leverage = this.evaluateLeverage(indicators)
      }
    }

    return {
      symbol,
      side,
      sl,
      tp,
      leverage,
      price: lastPrice,
    }
  }

  private evaluateSide(indicators: IndicatorCreate[]): Side {
    const sideRules: IndicatorSideRuleSettings[] = this.settings.side

    for (const rule of sideRules) {
      if (!rule.conditions || rule.conditions.length === 0) {
        return rule.value
      }

      const isMatch: boolean = rule.conditions.every(
        (condition: IndicatorConditionRuleSettings) =>
          this.checkCondition(indicators, condition),
      )

      if (isMatch) {
        return rule.value
      }
    }

    return sideRules[sideRules.length - 1].value
  }

  private evaluateLeverage(indicators: IndicatorCreate[]): number {
    const leverageRules: IndicatorLeverageRuleSettings[] =
      this.settings.leverage

    for (const rule of leverageRules) {
      if (!rule.conditions || rule.conditions.length === 0) {
        return rule.value
      }

      const isMatch: boolean = rule.conditions.every(
        (condition: IndicatorConditionRuleSettings) =>
          this.checkCondition(indicators, condition),
      )

      if (isMatch) {
        return rule.value
      }
    }

    return leverageRules[leverageRules.length - 1].value
  }

  private evaluateStopLoss(
    indicators: IndicatorCreate[],
    lastPrice: number,
    side: Side,
  ): number {
    const atrValues: number[] = this.settings.sl.atr
      .map(({ period, multiplier }) => {
        const atr: number = this.getIndicatorValue(indicators, 'atr', period)
        return (atr * multiplier) / lastPrice
      })
      .filter((sl: number): boolean => sl > 0)

    let sl: number = this.getMedian(atrValues)

    sl = Math.max(this.settings.sl.min, Math.min(sl, this.settings.sl.max))

    const price: number =
      side === 'long' ? lastPrice * (1 - sl) : lastPrice * (1 + sl)

    return this.roundPrice(price)
  }

  private evaluateTakeProfit(
    indicators: IndicatorCreate[],
    lastPrice: number,
    side: Side,
  ): number | undefined {
    const atrValues: number[] = this.settings.tp.atr
      .map(({ period, multiplier }) => {
        const atr: number = this.getIndicatorValue(indicators, 'atr', period)
        return (atr * multiplier) / lastPrice
      })
      .filter((tp: number): boolean => tp > 0)

    let tp: number = this.getMedian(atrValues)

    if (tp <= this.settings.tp.min) {
      return undefined
    }

    tp = Math.min(tp, this.settings.tp.max)

    const price: number =
      side === 'long' ? lastPrice * (1 + tp) : lastPrice * (1 - tp)

    return this.roundPrice(price)
  }

  private getMedian(values: number[]): number {
    if (values.length === 0) return 0

    const sorted: number[] = values.sort((a: number, b: number) => a - b)
    const mid: number = Math.floor(sorted.length / 2)

    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2
  }

  private checkCondition(
    indicators: IndicatorCreate[],
    condition: IndicatorConditionRuleSettings,
  ): boolean {
    const value: number = this.getIndicatorValue(
      indicators,
      condition.indicator,
      condition.period,
    )

    if (condition.compareWith) {
      const compareValue: number = this.getIndicatorValue(
        indicators,
        condition.compareWith.indicator,
        condition.compareWith.period,
      )

      return condition.condition === '>'
        ? value > compareValue
        : value < compareValue
    }

    if (condition.threshold) {
      return condition.condition === '>'
        ? value > condition.threshold
        : value < condition.threshold
    }

    throw new Error(
      'The condition rule must have either a threshold or a compareWith property.',
    )
  }

  private getIndicatorValue(
    indicators: IndicatorCreate[],
    name: string,
    period: number,
  ): number {
    return (
      indicators.find(
        (i: IndicatorCreate) =>
          i.name.toLowerCase() === name.toLowerCase() && i.period === period,
      )?.value ?? 0
    )
  }
  private roundPrice(price: number): number {
    if (price >= 1) {
      return parseFloat(price.toFixed(2))
    }
    const decimals: number = Math.max(6, -Math.floor(Math.log10(price)))
    return parseFloat(price.toFixed(decimals))
  }
}
