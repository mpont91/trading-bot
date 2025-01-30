import { Container } from '../../di'
import { BitmartApiService } from '../../domain/services/bitmart-api-service'
import { Balance } from '../../domain/types/balance'

async function start(): Promise<void> {
  const bitmartApiService: BitmartApiService = Container.getBitmartApiService()
  const response: Balance = await bitmartApiService.getBalance()
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the balance:', error)
})
