import fs from 'fs'
import { Container } from '../../di'
import { Candle } from '../../domain/types/candle'
import { BacktesterService } from '../../domain/services/backtester-service'
import {
  BacktestingSettings,
  BacktestingSummary,
} from '../../domain/types/backtesting'
import { InvestmentService } from '../../domain/services/investment-service'
import { StrategyReportService } from '../../domain/services/strategy-report-service'
import { z } from 'zod'
import { Plan } from '../../domain/plans/plan'

function settings(): BacktestingSettings {
  return {
    initialEquity: 1000,
    commissionRate: 0.00075,
  }
}

function initializeBacktesterService(): BacktesterService {
  const backtestingSettings: BacktestingSettings = settings()
  const strategyReportService: StrategyReportService =
    Container.getStrategyReportService()
  const investmentService: InvestmentService = Container.getInvestmentService()
  const plan: Plan = Container.getBtcusdcPlan()

  return new BacktesterService(
    plan,
    strategyReportService,
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
