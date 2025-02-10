import { Container } from '../../di'
import { ApiSpotService } from '../../domain/services/api-spot-service'
import { Kline } from '../../domain/types/kline'

async function start(): Promise<void> {
  const apiSpotService: ApiSpotService = Container.getApiSpotConcreteService()
  const symbol: string = process.argv[2]

  const response: Kline[] = await apiSpotService.getKlineHistory(symbol)
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the kline history:', error)
})
