import { IndicatorList } from '../models/indicator'
import { Stops } from '../models/strategy'

export class RiskService {
  shouldBuy(indicators: IndicatorList): boolean {
    const { bb, sma, rsi, adx, smaCross } = indicators

    const isTrendingUp = sma.price > sma.sma
    const isGoldenCross = smaCross.smaShort > smaCross.smaLong
    const hasStrongTrend = adx.adx > 25
    const hasBullishMomentum = rsi.rsi > 50 && rsi.rsi < 70
    const notOverextended = bb.price < bb.upper

    return (
      isTrendingUp &&
      isGoldenCross &&
      hasStrongTrend &&
      hasBullishMomentum &&
      notOverextended
    )
  }

  shouldSell(indicators: IndicatorList): boolean {
    const { bb, rsi, smaCross } = indicators

    const isDeathCross = smaCross.smaShort < smaCross.smaLong
    const hasBearishMomentum = rsi.rsi < 45
    const trendIsWeakening = bb.price < bb.middle

    return isDeathCross || hasBearishMomentum || trendIsWeakening
  }

  stops(indicators: IndicatorList): Stops | null {
    const { bb, atr } = indicators

    const price = bb.price
    const minRiskRewardRatio = 1.5

    const slPadding = (price - bb.lower) * 0.1
    const slPrice = bb.lower - slPadding
    const tpPrice = bb.upper

    if (slPrice >= price || tpPrice <= price) {
      return null
    }

    const riskAmount = price - slPrice
    const rewardAmount = tpPrice - price
    const riskRewardRatio = rewardAmount / riskAmount

    if (riskRewardRatio < minRiskRewardRatio) {
      return null
    }

    const slPercent = (riskAmount / price) * 100
    const tpPercent = (rewardAmount / price) * 100

    const trailingStopMultiplier = 1.5
    const tsPercent = ((atr.atr * trailingStopMultiplier) / price) * 100

    return {
      sl: slPercent,
      tp: tpPercent,
      ts: tsPercent,
      tpPrice,
      slPrice,
    }
  }
}
