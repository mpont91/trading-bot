import { Container } from '../../di'
import { ApiSpotService } from '../../domain/services/api-spot-service'

async function start(): Promise<void> {
  const binanceApiService: ApiSpotService = Container.getBinanceApiService()
  const symbol: string = process.argv[2]
  const response: number = await binanceApiService.getPrice(symbol)
  console.log(response)
}

start().catch((error: unknown): void => {
  console.error(`Error getting the price:`, error)
})
