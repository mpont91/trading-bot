import { Kline } from '../types/kline'
import { IndicatorListCreate } from '../models/indicator'
import { RiskCreate } from '../models/risk'
import { calculateSL } from '../helpers/stops-helper'
import {
  BacktestingPosition,
  BacktestingSettings,
  BacktestingSummary,
} from '../types/backtesting'
import { IndicatorService } from './indicator-service'
import { RiskService } from './risk-service'
import { InvestmentService } from './investment-service'
import { Balance } from '../types/balance'

export class BacktesterService {
  summary: BacktestingSummary
  position: BacktestingPosition | null
  commissionRate: number
  historyLimit: number
  cash: number

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly riskService: RiskService,
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
    }
    this.position = null
    this.commissionRate = this.backtestingSettings.commissionRate
    this.historyLimit = this.backtestingSettings.historyLimit
    this.cash = this.backtestingSettings.initialEquity
  }

  simulate(symbol: string, klines: Kline[]): BacktestingSummary {
    for (
      let i: number = this.backtestingSettings.historyLimit;
      i < klines.length;
      i++
    ) {
      const currentKlines: Kline[] = klines.slice(
        i - this.backtestingSettings.historyLimit,
        i + 1,
      )
      const indicators: IndicatorListCreate =
        this.indicatorService.calculateAll(symbol, currentKlines)

      const risk: RiskCreate = this.riskService.evaluate(indicators)

      if (this.position) {
        if (risk.shouldSell) {
          this.summary.sell++
          this.sell(klines[i].closePrice)
          continue
        }

        if (klines[i].lowPrice <= this.position.slPrice) {
          this.summary.sl++
          this.sell(this.position.slPrice)
          continue
        }

        if (
          this.position.tsPrice &&
          klines[i].lowPrice <= this.position.tsPrice
        ) {
          this.summary.ts++
          this.sell(this.position.tsPrice)
          continue
        }

        this.trailing(klines[i].highPrice)
      } else {
        if (risk.shouldBuy) {
          this.buy(risk)
        }
      }
    }

    if (this.position) {
      this.sell(klines[klines.length - 1].closePrice)
    }

    this.summary.finalEquity = this.cash
    this.summary.pnl = this.summary.finalEquity - this.summary.initialEquity
    this.summary.net = this.summary.pnl - this.summary.fees

    return this.summary
  }

  buy(risk: RiskCreate): void {
    if (this.position) {
      throw new Error('There is already an open position when trying to buy!')
    }

    const balance: Balance = {
      equity: this.cash,
      available: this.cash,
    }

    const amount: number =
      this.investmentService.calculateInvestmentAmount(balance)

    const quantity: number = (amount * (1 - this.commissionRate)) / risk.price

    this.position = {
      entryPrice: risk.price,
      quantity: quantity,
      tpPrice: risk.tpPrice!,
      slPrice: risk.slPrice!,
      ts: risk.ts!,
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

    this.cash += amount * (1 - this.commissionRate)
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
}
