import { Candle } from '../types/candle'
import { StrategyReportCreate } from '../models/strategy-report'
import { calculateSL } from '../helpers/stops-helper'
import {
  BacktestingPosition,
  BacktestingSettings,
  BacktestingSummary,
} from '../types/backtesting'
import { InvestmentService } from './investment-service'
import { Balance } from '../types/balance'
import { StrategyReportService } from './strategy-report-service'
import { StrategyActionCreate } from '../models/strategy-action'
import { Plan } from '../plans/plan'

export class BacktesterService {
  summary: BacktestingSummary
  position: BacktestingPosition | null
  commissionRate: number
  candles: number
  cash: number

  constructor(
    private readonly plan: Plan,
    private readonly strategyReportService: StrategyReportService,
    private readonly investmentService: InvestmentService,
    private readonly backtestingSettings: BacktestingSettings,
  ) {
    this.summary = {
      initialEquity: this.backtestingSettings.initialEquity,
      finalEquity: 0,
      fees: 0,
      trades: 0,
      success: 0,
      failed: 0,
      sell: 0,
      sl: 0,
      ts: 0,
      pnl: 0,
      net: 0,
      signalHold: 0,
      signalBuy: 0,
      signalSell: 0,
      buyConditions: {},
      sellConditions: {},
    }
    this.position = null
    this.commissionRate = this.backtestingSettings.commissionRate
    this.candles = this.plan.getCandles()
    this.cash = this.backtestingSettings.initialEquity
  }

  simulate(symbol: string, candles: Candle[]): BacktestingSummary {
    for (let i: number = this.candles; i < candles.length; i++) {
      const currentCandles: Candle[] = candles.slice(i - this.candles, i + 1)
      const strategyReport: StrategyReportCreate =
        this.plan.calculate(currentCandles)

      this.countConditions(strategyReport)

      const strategyAction: StrategyActionCreate =
        this.strategyReportService.calculateStrategyAction(strategyReport)

      switch (strategyAction.signal) {
        case 'HOLD':
          this.summary.signalHold++
          break
        case 'SELL':
          this.summary.signalSell++
          break
        case 'BUY':
          this.summary.signalBuy++
          break
      }

      if (this.position) {
        if (strategyAction.signal === 'SELL') {
          this.summary.sell++
          this.sell(candles[i].closePrice)
          continue
        }

        if (candles[i].lowPrice <= this.position.slPrice) {
          this.summary.sl++
          this.sell(this.position.slPrice)
          continue
        }

        if (
          this.position.tsPrice &&
          candles[i].lowPrice <= this.position.tsPrice
        ) {
          this.summary.ts++
          this.sell(this.position.tsPrice)
          continue
        }

        this.trailing(candles[i].highPrice)
      } else {
        if (strategyAction.signal === 'BUY') {
          this.buy(strategyAction)
        }
      }
    }

    if (this.position) {
      this.sell(candles[candles.length - 1].closePrice)
    }

    this.summary.finalEquity = this.cash
    this.summary.pnl = this.summary.finalEquity - this.summary.initialEquity
    this.summary.net = this.summary.pnl - this.summary.fees

    return this.summary
  }

  buy(strategy: StrategyActionCreate): void {
    if (this.position) {
      throw new Error('There is already an open position when trying to buy!')
    }

    const balance: Balance = {
      equity: this.cash,
      available: this.cash,
    }

    const amount: number =
      this.investmentService.calculateInvestmentAmount(balance)

    const quantity: number = amount / strategy.price

    this.position = {
      entryPrice: strategy.price,
      quantity: quantity,
      tpPrice: strategy.tpPrice!,
      slPrice: strategy.slPrice!,
      ts: strategy.ts!,
      tsPrice: null,
    }
    this.cash -= amount
    this.summary.fees += amount * this.commissionRate
  }

  sell(price: number): void {
    if (!this.position) {
      throw new Error('There is no open position to sell!')
    }

    const amount: number = this.position.quantity * price

    this.cash += amount
    this.summary.fees += amount * this.commissionRate
    this.summary.trades++
    if (this.position.entryPrice <= price) {
      this.summary.success++
    } else {
      this.summary.failed++
    }

    this.position = null
  }

  trailing(price: number): void {
    if (!this.position) {
      throw new Error('There is no open position to do the trailing process!')
    }

    if (!this.position.tsPrice && price >= this.position.tpPrice) {
      this.position.tsPrice = calculateSL(
        this.position.tpPrice,
        this.position.ts,
      )
    } else if (this.position.tsPrice) {
      const potentialNewTsPrice = calculateSL(price, this.position.ts)
      if (potentialNewTsPrice > this.position.tsPrice) {
        this.position.tsPrice = potentialNewTsPrice
      }
    }
  }

  private countConditions(report: StrategyReportCreate): void {
    const { buy, sell } = report.conditions

    for (const [key, value] of Object.entries(buy)) {
      if (value) {
        this.summary.buyConditions[key] =
          (this.summary.buyConditions[key] || 0) + 1
      }
    }

    for (const [key, value] of Object.entries(sell)) {
      if (value) {
        this.summary.sellConditions[key] =
          (this.summary.sellConditions[key] || 0) + 1
      }
    }
  }
}
