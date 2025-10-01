import fs from 'fs'
import { Container } from '../../di'
import { Kline } from '../../domain/types/kline'
import { IndicatorService } from '../../domain/services/indicator-service'
import { RiskService } from '../../domain/services/risk-service'
import { settings } from '../../application/settings'
import { IndicatorListCreate } from '../../domain/models/indicator'
import { RiskCreate } from '../../domain/models/risk'
import { calculateSL } from '../../domain/helpers/stops-helper'

interface Position {
  entryPrice: number
  amount: number
  tpPrice: number
  slPrice: number
  ts: number
  tsPrice: number | null
}

interface Summary {
  initialEquity: number
  finalEquity: number
  fees: number
  trades: number
  success: number
  failed: number
  sell: number
  sl: number
  ts: number
}

const indicatorService: IndicatorService = Container.getIndicatorService()
const riskService: RiskService = Container.getRiskService()

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const file: string = `./data/${symbol.toLowerCase()}.json`

  if (!fs.existsSync(file)) {
    throw new Error(
      `Data file not found. Please run backtester-fetch first. File: ${file}`,
    )
  }

  const klines: Kline[] = JSON.parse(
    fs.readFileSync(`./data/${symbol.toLowerCase()}.json`, 'utf-8'),
  )

  simulate(symbol, klines)
}

function simulate(symbol: string, klines: Kline[]): void {
  const summary: Summary = {
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
  let position: Position | null = null
  const commissionRate = 0.00075

  for (let i: number = warmup; i < klines.length; i++) {
    const currentKlines: Kline[] = klines.slice(i - warmup, i + 1)

    const indicators: IndicatorListCreate = indicatorService.calculateAll(
      symbol,
      currentKlines,
    )

    const risk: RiskCreate = riskService.evaluate(indicators)

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
      summary.finalEquity = position.amount * risk.price * (1 - commissionRate)
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

  console.dir(summary, { depth: null })
}
