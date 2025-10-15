import fs from 'fs'
import { Container } from '../../di'
import { Candle } from '../../domain/types/candle'
import { IndicatorService } from '../../domain/services/indicator-service'
import { BacktesterService } from '../../domain/services/backtester-service'
import {
  BacktestingSettings,
  BacktestingSummary,
} from '../../domain/types/backtesting'
import { InvestmentService } from '../../domain/services/investment-service'
import { StrategyReportService } from '../../domain/services/strategy-report-service'
import { StrategyBTCUSDC } from '../../domain/strategies/strategy-btcusdc'
import { z } from 'zod'

function settings(): BacktestingSettings {
  return {
    initialEquity: 1000,
    commissionRate: 0.00075,
  }
}

function initializeBacktesterService(): BacktesterService {
  const backtestingSettings: BacktestingSettings = settings()
  const indicatorService: IndicatorService = Container.getIndicatorService()
  const strategyReportService: StrategyReportService =
    Container.getStrategyReportService()
  const investmentService: InvestmentService = Container.getInvestmentService()
  const strategy: StrategyBTCUSDC = Container.getStrategyBTCUSDC()

  return new BacktesterService(
    indicatorService,
    strategyReportService,
    strategy,
    investmentService,
    backtestingSettings,
  )
}

const requestSchema = z.object({
  symbol: z.string().transform((s) => s.toLowerCase()),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const file: string = `./data/${symbol}.json`

  if (!fs.existsSync(file)) {
    throw new Error(
      `Data file not found. Please run backtester-fetch first. File: ${file}`,
    )
  }

  const candles: Candle[] = JSON.parse(
    fs.readFileSync(`./data/${symbol}.json`, 'utf-8'),
  )

  const backtesterService: BacktesterService = initializeBacktesterService()

  const response: BacktestingSummary = backtesterService.simulate(
    symbol,
    candles,
  )

  console.dir(response, { depth: null })
}
