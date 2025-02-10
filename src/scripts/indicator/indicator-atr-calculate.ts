import { Container } from '../../di'
import { ApiSpotService } from '../../domain/services/api-spot-service'
import { Kline } from '../../domain/types/kline'
import { Indicator } from '../../domain/indicators/indicator'
import { IndicatorCreate } from '../../domain/models/indicator'

async function start(): Promise<void> {
  const apiSpotService: ApiSpotService = Container.getApiSpotConcreteService()
  const indicator: Indicator = Container.getAtrIndicator()
  const symbol: string = process.argv[2]

  const klines: Kline[] = await apiSpotService.getKlineHistory(symbol)
  const values: IndicatorCreate[] = indicator.calculate(symbol, klines)

  console.dir(values, { depth: null })
}

start().catch((error: unknown): void => {
  console.error(`Error getting the ATR indicator values:`, error)
})
