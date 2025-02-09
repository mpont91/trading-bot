import { Container } from '../../di'
import { Balance } from '../../domain/types/balance'
import { ApiSpotService } from '../../domain/services/api-spot-service'

async function start(): Promise<void> {
  const binanceApiService: ApiSpotService = Container.getBinanceApiService()
  const response: Balance = await binanceApiService.getBalance()
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the balance:', error)
})
