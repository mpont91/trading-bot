import { IndicatorCreate } from '../models/indicator'
import { StrategyCreate } from '../models/strategy'
import { Side } from '../types/side'
import {
  IndicatorConditionRuleSettings,
  IndicatorLeverageRuleSettings,
  IndicatorSideRuleSettings,
  IndicatorsRulesSettings,
} from '../../application/settings'

export class PredictionService {
  constructor(private settings: IndicatorsRulesSettings) {}

  async predict(indicators: IndicatorCreate[]): Promise<StrategyCreate> {
    const lastPrice: number = indicators[0].price!
    const symbol: string = indicators[0].symbol!

    const side: Side = this.evaluateSide(indicators)

    let sl: number | undefined
    let tp: number | undefined
    let leverage: number | undefined

    if (side !== 'hold') {
      tp = this.evaluateTakeProfit(indicators)
      sl = this.evaluateStopLoss(indicators)
      leverage = this.evaluateLeverage(indicators)
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

  private evaluateStopLoss(indicators: IndicatorCreate[]): number {
    const atrValues: number[] = this.settings.sl
      .map(({ period, multiplier }) => {
        const atr = this.getIndicatorValue(indicators, 'atr', period)
        return atr * multiplier
      })
      .filter((sl: number): boolean => sl > 0)

    return this.getMedian(atrValues)
  }

  private evaluateTakeProfit(indicators: IndicatorCreate[]): number {
    const atrValues: number[] = this.settings.tp
      .map(({ period, multiplier }) => {
        const atr: number = this.getIndicatorValue(indicators, 'atr', period)
        return atr * multiplier
      })
      .filter((tp): boolean => tp > 0)

    return this.getMedian(atrValues)
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
    condition: {
      indicator: string
      period: number
      threshold: number
      condition: '>' | '<'
    },
  ): boolean {
    const value: number = this.getIndicatorValue(
      indicators,
      condition.indicator,
      condition.period,
    )

    return condition.condition === '>'
      ? value > condition.threshold
      : value < condition.threshold
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
}
