import fs from 'fs'
import { Container } from '../../di'
import { Candle } from '../../domain/types/Candle'
import { IndicatorService } from '../../domain/services/indicator-service'
import { RiskService } from '../../domain/services/risk-service'
import { BacktesterService } from '../../domain/services/backtester-service'
import {
  BacktestingSettings,
  BacktestingSummary,
} from '../../domain/types/backtesting'
import { InvestmentService } from '../../domain/services/investment-service'
import { DecisionService } from '../../domain/services/decision-service'

function settings(): BacktestingSettings {
  return {
    initialEquity: 1000,
    commissionRate: 0.00075,
  }
}

function initializeBacktesterService(): BacktesterService {
  const backtestingSettings: BacktestingSettings = settings()
  const indicatorService: IndicatorService = Container.getIndicatorService()
  const riskService: RiskService = Container.getRiskService()
  const decisionService: DecisionService = Container.getDecisionService()
  const investmentService: InvestmentService = Container.getInvestmentService()

  return new BacktesterService(
    indicatorService,
    riskService,
    decisionService,
    investmentService,
    backtestingSettings,
  )
}

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

  const candles: Candle[] = JSON.parse(
    fs.readFileSync(`./data/${symbol.toLowerCase()}.json`, 'utf-8'),
  )

  const backtesterService: BacktesterService = initializeBacktesterService()

  const response: BacktestingSummary = backtesterService.simulate(
    symbol,
    candles,
  )

  console.dir(response, { depth: null })
}
