import { Container } from '../../di'
import { ApiFuturesService } from '../../domain/services/api-futures-service'
import { Balance } from '../../domain/types/balance'

async function start(): Promise<void> {
  const bitmartApiService: ApiFuturesService = Container.getBitmartApiService()
  const response: Balance = await bitmartApiService.getBalance()
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the balance:', error)
})
