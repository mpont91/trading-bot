import fs from 'fs'
import { Container } from '../../di'
import { Kline } from '../../domain/types/kline'
import { IndicatorService } from '../../domain/services/indicator-service'
import { RiskService } from '../../domain/services/risk-service'
import { BacktesterService } from '../../domain/services/backtester-service'
import {
  BacktestingSettings,
  BacktestingSummary,
} from '../../domain/types/backtesting'
import { InvestmentService } from '../../domain/services/investment-service'
import { ApiService } from '../../domain/services/api-service'

function settings(): BacktestingSettings {
  return {
    initialEquity: 1000,
    commissionRate: 0.00075,
    historyLimit: 240,
    safetyCapitalMargin: 0.3,
    maxPositionsOpened: 1,
  }
}

function initializeBacktesterService(): BacktesterService {
  const backtestingSettings: BacktestingSettings = settings()
  const apiService: ApiService = Container.getApiService()
  const indicatorService: IndicatorService = Container.getIndicatorService()
  const riskService: RiskService = Container.getRiskService()
  const investmentService: InvestmentService = new InvestmentService(
    backtestingSettings.safetyCapitalMargin,
    backtestingSettings.maxPositionsOpened,
    apiService,
  )

  return new BacktesterService(
    indicatorService,
    riskService,
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

  const klines: Kline[] = JSON.parse(
    fs.readFileSync(`./data/${symbol.toLowerCase()}.json`, 'utf-8'),
  )

  const backtesterService: BacktesterService = initializeBacktesterService()

  const response: BacktestingSummary = backtesterService.simulate(
    symbol,
    klines,
  )

  console.dir(response, { depth: null })
}
