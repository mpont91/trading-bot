import { Container } from '../../di'
import { ApiSpotService } from '../../domain/services/api-spot-service'
import { Kline } from '../../domain/types/kline'
import { IndicatorService } from '../../domain/services/indicator-service'
import { IndicatorCreate } from '../../domain/models/indicator'

async function start(): Promise<void> {
  const apiSpotService: ApiSpotService = Container.getApiSpotConcreteService()
  const indicatorService: IndicatorService = Container.getSmaIndicatorService()
  const symbol: string = process.argv[2]

  const klines: Kline[] = await apiSpotService.getKlineHistory(symbol)
  const values: IndicatorCreate[] = indicatorService.calculate(symbol, klines)

  console.dir(values, { depth: null })
}

start().catch((error: unknown): void => {
  console.error(`Error getting the sma indicator value:`, error)
})
