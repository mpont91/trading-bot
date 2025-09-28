import { IndicatorList } from '../models/indicator'
import { Stops } from '../models/strategy'
import { RiskSettings } from '../types/settings'
import { RiskRepository } from '../repositories/risk-repository'
import { BuyConditions, Risk, RiskCreate, SellConditions } from '../models/risk'
import { median } from '../helpers/math-helper'
export class RiskService {
  constructor(
    private readonly settings: RiskSettings,
    private readonly riskRepository: RiskRepository,
  ) {}

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

    const buyConditions: BuyConditions = this.evaluateBuyConditions(indicators)
    const sellConditions: SellConditions =
      this.evaluateSellConditions(indicators)
    let shouldBuy: boolean = this.evaluateShouldBuy(buyConditions)
    const shouldSell: boolean = this.evaluateShouldSell(sellConditions)
    let stops: Stops = {
      sl: undefined,
      tp: undefined,
      ts: undefined,
      tpPrice: undefined,
      slPrice: undefined,
    }
    let riskReward: boolean | undefined = undefined
    let validStops: boolean | undefined = undefined

    if (shouldBuy) {
      const stopsEvaluated: Stops = this.evaluateStops(indicators)
      riskReward = this.evaluateRiskReward(price, stopsEvaluated)
      validStops = this.evaluateValidStops(price, stopsEvaluated)

      if (!riskReward || !validStops) {
        shouldBuy = false
      } else {
        stops = stopsEvaluated
      }
    }

    const risk: RiskCreate = {
      symbol,
      price,
      ...buyConditions,
      ...sellConditions,
      ...stops,
      validStops,
      riskReward,
      shouldBuy,
      shouldSell,
    }

    return await this.riskRepository.create(risk)
  }

  private evaluateBuyConditions(indicators: IndicatorList): BuyConditions {
    const { bb, sma, rsi, adx, smaCross } = indicators

    const bullishMomentumMin: boolean =
      rsi.rsi > this.settings.bullishMomentumMin
    const bullishMomentumMax: boolean =
      rsi.rsi < this.settings.bullishMomentumMax

    return {
      trendUp: sma.price > sma.sma,
      goldenCross: smaCross.smaShort > smaCross.smaLong,
      strongTrend: adx.adx > this.settings.strongTrendMin,
      bullishDirection: adx.pdi > adx.mdi,
      bullishMomentum: bullishMomentumMin && bullishMomentumMax,
      notOverextended: bb.price < bb.upper,
    }
  }

  private evaluateSellConditions(indicators: IndicatorList): SellConditions {
    const { smaCross, rsi, bb } = indicators
    return {
      deathCross: smaCross.smaShort < smaCross.smaLong,
      bearishMomentum: rsi.rsi < this.settings.bearishMomentumMax,
      trendWeakening: bb.price < bb.middle,
    }
  }

  private evaluateShouldSell(sellConditions: SellConditions): boolean {
    return (
      sellConditions.deathCross ||
      (sellConditions.bearishMomentum && sellConditions.trendWeakening)
    )
  }

  private evaluateShouldBuy(buyConditions: BuyConditions): boolean {
    return (
      buyConditions.trendUp &&
      buyConditions.goldenCross &&
      buyConditions.strongTrend &&
      buyConditions.bullishDirection &&
      buyConditions.bullishMomentum &&
      buyConditions.notOverextended
    )
  }

  private evaluateStops(indicators: IndicatorList): Stops {
    const { bb, atr } = indicators

    const price: number = bb.price

    const slPadding: number =
      (price - bb.lower) * this.settings.slPaddingPercentage
    const slPrice: number = bb.lower - slPadding
    const tpPrice: number = bb.upper

    const riskAmount: number = price - slPrice
    const rewardAmount: number = tpPrice - price

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

  private evaluateRiskReward(price: number, stops: Stops): boolean {
    if (!stops.slPrice || !stops.tpPrice) {
      return false
    }

    const riskAmount: number = price - stops.slPrice
    const rewardAmount: number = stops.tpPrice - price
    const riskRewardRatio: number = rewardAmount / riskAmount

    return riskRewardRatio > this.settings.minRiskRewardRatio
  }

  private evaluateValidStops(price: number, stops: Stops): boolean {
    if (!stops.slPrice || !stops.tpPrice) {
      return false
    }

    return stops.slPrice < price && stops.tpPrice > price
  }
}
