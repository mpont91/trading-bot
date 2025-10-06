import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { StrategyMeanReversion } from '../types/settings'
import { StrategyReportRepository } from '../repositories/strategy-report-repository'
import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'
import { median } from '../helpers/math-helper'
import { Strategy } from './strategy'
import { StrategyStops } from '../types/strategy-stops'
import {
  StrategyBuyConditions,
  StrategySellConditions,
} from '../types/strategy-conditions'
export class MeanReversionStrategy implements Strategy {
  constructor(
    private readonly settings: StrategyMeanReversion,
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

    const buyConditions: StrategyBuyConditions =
      this.evaluateBuyConditions(indicators)
    const sellConditions: StrategySellConditions =
      this.evaluateSellConditions(indicators)
    const shouldBuy: boolean = this.evaluateShouldBuy(buyConditions)
    const shouldSell: boolean = this.evaluateShouldSell(sellConditions)
    let stops: StrategyStops = {
      sl: null,
      tp: null,
      ts: null,
      tpPrice: null,
      slPrice: null,
    }

    if (shouldBuy) {
      stops = this.evaluateStops(indicators)
    }

    return {
      name: 'mean reversion strategy',
      symbol,
      price,
      conditions: {
        buy: buyConditions,
        sell: sellConditions,
      },
      ...stops,
      shouldBuy,
      shouldSell,
    }
  }

  private evaluateBuyConditions(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyBuyConditions {
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
  ): StrategySellConditions {
    const { smaCross, rsi, bb, adx } = indicators
    return {
      deathCross: smaCross.smaShort < smaCross.smaLong,
      bearishMomentum: rsi.rsi < this.settings.bearishMomentumMaxRSI,
      trendWeakening: bb.price < bb.middle,
      bearishConviction: adx.adx > this.settings.bearishConvictionMinADX,
    }
  }

  private evaluateShouldSell(sellConditions: StrategySellConditions): boolean {
    return (
      !!sellConditions.deathCross &&
      !!sellConditions.bearishMomentum &&
      !!sellConditions.trendWeakening &&
      !!sellConditions.bearishConviction
    )
  }

  private evaluateShouldBuy(buyConditions: StrategyBuyConditions): boolean {
    return this.calculateBuyScore(buyConditions) >= this.settings.buyScoreMin
  }

  private calculateBuyScore(buyConditions: StrategyBuyConditions): number {
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
  ): StrategyStops {
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
