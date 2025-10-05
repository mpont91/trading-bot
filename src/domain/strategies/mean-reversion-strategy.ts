import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { Stops } from '../models/strategy-action'
import { RiskSettings } from '../types/settings'
import { StrategyReportRepository } from '../repositories/strategy-report-repository'
import {
  BuyConditions,
  StrategyReport,
  StrategyReportCreate,
  SellConditions,
} from '../models/strategy-report'
import { median } from '../helpers/math-helper'
import { Strategy } from './strategy'
export class MeanReversionStrategy implements Strategy {
  constructor(
    private readonly settings: RiskSettings,
    private readonly strategyReportRepository: StrategyReportRepository,
  ) {}

  async calculateAndCreate(
    indicators: IndicatorList | IndicatorListCreate,
  ): Promise<StrategyReport> {
    return await this.create(this.calculate(indicators))
  }

  async create(strategyReport: StrategyReportCreate): Promise<StrategyReport> {
    return await this.strategyReportRepository.create(strategyReport)
  }

  calculate(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyReportCreate {
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
      favorableEntryPrice: bb.pb <= this.settings.favorableEntryPriceMaxBB,
    }
  }

  private evaluateSellConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): SellConditions {
    const { smaCross, rsi, bb, adx } = indicators
    return {
      deathCross: smaCross.smaShort < smaCross.smaLong,
      bearishMomentum: rsi.rsi < this.settings.bearishMomentumMaxRSI,
      trendWeakening: bb.price < bb.middle,
      bearishConviction: adx.adx > this.settings.bearishConvictionMinADX,
    }
  }

  private evaluateShouldSell(sellConditions: SellConditions): boolean {
    return (
      sellConditions.deathCross &&
      sellConditions.bearishMomentum &&
      sellConditions.trendWeakening &&
      sellConditions.bearishConviction
    )
  }

  private evaluateShouldBuy(buyConditions: BuyConditions): boolean {
    return this.calculateBuyScore(buyConditions) >= this.settings.buyScoreMin
  }

  private calculateBuyScore(buyConditions: BuyConditions): number {
    if (!buyConditions.goldenCross || !buyConditions.favorableEntryPrice) {
      return 0
    }

    let score: number = 0

    if (buyConditions.favorableEntryPrice) score += 3
    if (buyConditions.goldenCross) score += 2
    if (buyConditions.bullishDirection) score += 1
    if (buyConditions.bullishMomentum) score += 1
    if (buyConditions.strongTrend) score += 1

    return score
  }

  private evaluateStops(
    indicators: IndicatorList | IndicatorListCreate,
  ): Stops {
    const { bb, atr } = indicators

    const price: number = bb.price

    const slPrice: number = bb.lower
    const tpPrice: number = bb.upper

    const sl: number = price - slPrice
    const tp: number = tpPrice - price

    const slPercent: number = (sl / price) * 100
    const tpPercent: number = (tp / price) * 100

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
