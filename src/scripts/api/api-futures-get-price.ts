import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'

async function start(): Promise<void> {
  const apiService: ApiService = Container.getApiFuturesService()
  const symbol: string = process.argv[2]
  const response: number = await apiService.getPrice(symbol)
  console.log(response)
}

start().catch((error: unknown): void => {
  console.error(`Error getting the price:`, error)
})
