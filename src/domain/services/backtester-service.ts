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

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly riskService: RiskService,
    private readonly investmentService: InvestmentService,
    private readonly backtestingSettings: BacktestingSettings,
  ) {
    this.summary = {
      initialEquity: this.backtestingSettings.initialEquity,
      finalEquity: this.backtestingSettings.initialEquity,
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

      if (!this.position && risk.shouldBuy) {
        this.buy(risk)
        continue
      }

      if (
        this.position &&
        (risk.shouldSell ||
          klines[i].lowPrice <= this.position.slPrice ||
          (this.position.tsPrice &&
            klines[i].lowPrice <= this.position.tsPrice))
      ) {
        this.countReasonToSell(risk, klines[i].lowPrice)
        this.sell(risk.price)
      }

      if (this.position) {
        this.trailing(klines[i].highPrice)
      }
    }

    if (this.position) {
      this.sell(klines[klines.length - 1].closePrice)
    }

    this.summary.pnl = this.summary.finalEquity - this.summary.initialEquity
    this.summary.net = this.summary.pnl - this.summary.fees

    return this.summary
  }

  buy(risk: RiskCreate): void {
    if (this.position) {
      throw new Error('There is already an open position when trying to buy!')
    }

    const balance: Balance = {
      equity: this.summary.finalEquity,
      available: this.summary.finalEquity,
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
    this.summary.finalEquity -= amount
    this.summary.fees += amount * this.commissionRate
  }

  sell(price: number): void {
    if (!this.position) {
      throw new Error('There is no open position to sell!')
    }

    const amount: number = this.position.quantity * price

    this.summary.finalEquity += amount * (1 - this.commissionRate)
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

  countReasonToSell(risk: RiskCreate, price: number) {
    if (!this.position) {
      throw new Error('There is no open position to sell!')
    }
    if (risk.shouldSell) {
      this.summary.sell++
    } else if (price <= this.position.slPrice) {
      this.summary.sl++
    } else if (this.position.tsPrice && price <= this.position.tsPrice) {
      this.summary.ts++
    }
  }
}
