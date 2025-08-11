import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { Kline } from '../../domain/types/kline'

async function start(): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const symbol: string = process.argv[2]

  const response: Kline[] = await apiService.getKlineHistory(symbol)
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the kline history:', error)
})
