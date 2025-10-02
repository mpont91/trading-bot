import fs from 'fs'
import { Container } from '../../di'
import { Kline } from '../../domain/types/kline'
import { IndicatorService } from '../../domain/services/indicator-service'
import { RiskService } from '../../domain/services/risk-service'
import { BacktesterService } from '../../domain/services/backtester-service'
import { BacktestingSummary } from '../../domain/types/backtesting'

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

  const indicatorService: IndicatorService = Container.getIndicatorService()
  const riskService: RiskService = Container.getRiskService()

  const backtesterService: BacktesterService = new BacktesterService(
    indicatorService,
    riskService,
  )

  const response: BacktestingSummary = backtesterService.simulate(
    symbol,
    klines,
  )

  console.dir(response, { depth: null })
}
