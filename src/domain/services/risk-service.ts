import { IndicatorList } from '../models/indicator'
import { Stops } from '../models/strategy'
import { RiskSettings } from '../types/settings'
export class RiskService {
  constructor(private readonly settings: RiskSettings) {}

  shouldBuy(indicators: IndicatorList): boolean {
    const { bb, sma, rsi, adx, smaCross } = indicators

    const isTrendingUp: boolean = sma.price > sma.sma
    const isGoldenCross: boolean = smaCross.smaShort > smaCross.smaLong
    const hasStrongTrend: boolean = adx.adx > this.settings.strongTrendMin
    const hasBullishDirection: boolean = adx.pdi > adx.mdi
    const hasBullishMomentum: boolean =
      rsi.rsi > this.settings.bullishMomentumMin &&
      rsi.rsi < this.settings.bullishMomentumMax
    const notOverextended: boolean = bb.price < bb.upper

    return (
      isTrendingUp &&
      isGoldenCross &&
      hasStrongTrend &&
      hasBullishDirection &&
      hasBullishMomentum &&
      notOverextended
    )
  }

  shouldSell(indicators: IndicatorList): boolean {
    const { bb, rsi, smaCross } = indicators

    const isDeathCross: boolean = smaCross.smaShort < smaCross.smaLong
    const hasBearishMomentum: boolean =
      rsi.rsi < this.settings.bearishMomentumMax
    const trendIsWeakening: boolean = bb.price < bb.middle

    return isDeathCross || hasBearishMomentum || trendIsWeakening
  }

  stops(indicators: IndicatorList): Stops | null {
    const { bb, atr } = indicators

    const price: number = bb.price
    const minRiskRewardRatio: number = this.settings.minRiskRewardRatio

    const slPadding: number =
      (price - bb.lower) * this.settings.slPaddingPercentage
    const slPrice: number = bb.lower - slPadding
    const tpPrice: number = bb.upper

    if (slPrice >= price || tpPrice <= price) {
      return null
    }

    const riskAmount: number = price - slPrice
    const rewardAmount: number = tpPrice - price
    const riskRewardRatio: number = rewardAmount / riskAmount

    if (riskRewardRatio < minRiskRewardRatio) {
      return null
    }

    const slPercent: number = (riskAmount / price) * 100
    const tpPercent: number = (rewardAmount / price) * 100

    const trailingStopMultiplier: number = this.settings.trailingStopMultiplier
    const tsPercent: number = ((atr.atr * trailingStopMultiplier) / price) * 100

    return {
      sl: slPercent,
      tp: tpPercent,
      ts: tsPercent,
      tpPrice,
      slPrice,
    }
  }
}
