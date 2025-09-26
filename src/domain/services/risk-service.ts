import { IndicatorList } from '../models/indicator'
import { Stops } from '../models/strategy'
import { RiskSettings } from '../types/settings'
import { RiskRepository } from '../repositories/risk-repository'
import { Risk, RiskCreate } from '../models/risk'
import { median } from '../helpers/math-helper'
export class RiskService {
  constructor(
    private readonly settings: RiskSettings,
    private readonly riskRepository: RiskRepository,
  ) {}

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

  async evaluate(indicators: IndicatorList): Promise<Risk> {
    const { bb, sma, rsi, adx, atr, smaCross } = indicators

    const symbol: string = bb.symbol
    const price: number = median([
      bb.price,
      sma.price,
      rsi.price,
      atr.price,
      adx.price,
      smaCross.price,
    ])
    const isTrendingUp: boolean = sma.price > sma.sma
    const isGoldenCross: boolean = smaCross.smaShort > smaCross.smaLong
    const hasStrongTrend: boolean = adx.adx > this.settings.strongTrendMin
    const hasBullishDirection: boolean = adx.pdi > adx.mdi
    const hasBullishMomentum: boolean =
      rsi.rsi > this.settings.bullishMomentumMin &&
      rsi.rsi < this.settings.bullishMomentumMax
    const notOverextended: boolean = bb.price < bb.upper
    const isDeathCross: boolean = smaCross.smaShort < smaCross.smaLong
    const hasBearishMomentum: boolean =
      rsi.rsi < this.settings.bearishMomentumMax
    const trendIsWeakening: boolean = bb.price < bb.middle
    const shouldBuy: boolean =
      isTrendingUp &&
      isGoldenCross &&
      hasStrongTrend &&
      hasBullishDirection &&
      hasBullishMomentum &&
      notOverextended
    const shouldSell: boolean =
      isDeathCross || (hasBearishMomentum && trendIsWeakening)

    const risk: RiskCreate = {
      symbol,
      price,
      isTrendingUp,
      isGoldenCross,
      hasStrongTrend,
      hasBullishDirection,
      hasBullishMomentum,
      notOverextended,
      isDeathCross,
      hasBearishMomentum,
      trendIsWeakening,
      shouldBuy,
      shouldSell,
    }

    if (shouldBuy) {
      const stops: Stops | null = this.stops(indicators)
      if (stops) {
        if (stops) {
          risk.tp = stops.tp
          risk.sl = stops.sl
          risk.ts = stops.ts
          risk.tpPrice = stops.tpPrice
          risk.slPrice = stops.slPrice
        }
      }
    }

    return await this.riskRepository.create(risk)
  }
}
