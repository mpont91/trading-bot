import { Kline } from '../types/kline'
import { settings } from '../../application/settings'
import { IndicatorListCreate } from '../models/indicator'
import { RiskCreate } from '../models/risk'
import { calculateSL } from '../helpers/stops-helper'
import { BacktestingPosition, BacktestingSummary } from '../types/backtesting'
import { IndicatorService } from './indicator-service'
import { RiskService } from './risk-service'

export class BacktesterService {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly riskService: RiskService,
  ) {}

  simulate(symbol: string, klines: Kline[]): BacktestingSummary {
    const summary: BacktestingSummary = {
      initialEquity: 1000,
      finalEquity: 1000,
      fees: 0,
      trades: 0,
      success: 0,
      failed: 0,
      sell: 0,
      sl: 0,
      ts: 0,
    }

    const warmup: number = settings.history.klineHistoryLimit
    let position: BacktestingPosition | null = null
    const commissionRate = 0.00075

    for (let i: number = warmup; i < klines.length; i++) {
      const currentKlines: Kline[] = klines.slice(i - warmup, i + 1)

      const indicators: IndicatorListCreate =
        this.indicatorService.calculateAll(symbol, currentKlines)

      const risk: RiskCreate = this.riskService.evaluate(indicators)

      if (!position && risk.shouldBuy) {
        position = {
          entryPrice: risk.price,
          amount: (summary.finalEquity / risk.price) * (1 - commissionRate),
          tpPrice: risk.tpPrice!,
          slPrice: risk.slPrice!,
          ts: risk.ts!,
          tsPrice: null,
        }
        summary.finalEquity = 0
        summary.fees += (summary.finalEquity / risk.price) * commissionRate
        continue
      }

      if (
        position &&
        (risk.shouldSell ||
          klines[i].lowPrice <= position.slPrice ||
          (position.tsPrice && klines[i].lowPrice <= position.tsPrice))
      ) {
        summary.finalEquity =
          position.amount * risk.price * (1 - commissionRate)
        summary.fees += position.amount * risk.price * commissionRate
        summary.trades++
        if (position.entryPrice <= risk.price) {
          summary.success++
        } else {
          summary.failed++
        }

        if (risk.shouldSell) {
          summary.sell++
        } else if (klines[i].lowPrice <= position.slPrice) {
          summary.sl++
        } else if (position.tsPrice && klines[i].lowPrice <= position.tsPrice) {
          summary.ts++
        }

        position = null
      }

      if (position) {
        if (!position.tsPrice && klines[i].highPrice >= position.tpPrice) {
          position.tsPrice = calculateSL(position.tpPrice, position.ts)
        } else if (position.tsPrice) {
          const potentialNewTsPrice = calculateSL(
            klines[i].highPrice,
            position.ts,
          )
          if (potentialNewTsPrice > position.tsPrice) {
            position.tsPrice = potentialNewTsPrice
          }
        }
      }
    }

    if (position) {
      summary.finalEquity =
        position.amount *
        klines[klines.length - 1].closePrice *
        (1 - commissionRate)
      summary.fees +=
        position.amount * klines[klines.length - 1].closePrice * commissionRate
      summary.trades++
      if (position.entryPrice <= klines[klines.length - 1].closePrice) {
        summary.success++
      } else {
        summary.failed++
      }
    }

    return summary
  }
}
