import { IndicatorList, IndicatorListCreate } from '../models/indicator'
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

  async calculateAndCreate(
    indicators: IndicatorList | IndicatorListCreate,
  ): Promise<Risk> {
    return await this.create(this.calculate(indicators))
  }

  async create(risk: RiskCreate): Promise<Risk> {
    return await this.riskRepository.create(risk)
  }

  calculate(indicators: IndicatorList | IndicatorListCreate): RiskCreate {
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
    const shouldBuy: boolean = this.evaluateShouldBuy(buyConditions)
    const shouldSell: boolean = this.evaluateShouldSell(sellConditions)
    let stops: Stops = {
      sl: undefined,
      tp: undefined,
      ts: undefined,
      tpPrice: undefined,
      slPrice: undefined,
    }

    if (shouldBuy) {
      stops = this.evaluateStops(indicators)
    }

    return {
      symbol,
      price,
      ...buyConditions,
      ...sellConditions,
      ...stops,
      shouldBuy,
      shouldSell,
    }
  }

  private evaluateBuyConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): BuyConditions {
    const { bb, sma, rsi, adx, smaCross } = indicators

    const bullishMomentumMin: boolean =
      rsi.rsi > this.settings.bullishMomentumMinRSI
    const bullishMomentumMax: boolean =
      rsi.rsi < this.settings.bullishMomentumMaxRSI

    return {
      trendUp: sma.price > sma.sma,
      goldenCross: smaCross.smaShort > smaCross.smaLong,
      strongTrend: adx.adx > this.settings.strongTrendMinADX,
      bullishDirection: adx.pdi > adx.mdi,
      bullishMomentum: bullishMomentumMin && bullishMomentumMax,
      notOverextended: bb.price < bb.upper,
    }
  }

  private evaluateSellConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): SellConditions {
    const { smaCross, rsi, bb } = indicators
    return {
      deathCross: smaCross.smaShort < smaCross.smaLong,
      bearishMomentum: rsi.rsi < this.settings.bearishMomentumMaxRSI,
      trendWeakening: bb.price < bb.middle,
    }
  }

  private evaluateShouldSell(sellConditions: SellConditions): boolean {
    return (
      sellConditions.deathCross &&
      sellConditions.bearishMomentum &&
      sellConditions.trendWeakening
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

  private evaluateStops(
    indicators: IndicatorList | IndicatorListCreate,
  ): Stops {
    const { bb, atr } = indicators

    const price: number = bb.price

    const slPrice: number = bb.lower
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
}
