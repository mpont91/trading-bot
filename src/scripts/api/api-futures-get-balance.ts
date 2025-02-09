import { Container } from '../../di'
import { Balance } from '../../domain/types/balance'
import { ApiService } from '../../domain/services/api-service'

async function start(): Promise<void> {
  const apiService: ApiService = Container.getApiFuturesService()
  const response: Balance = await apiService.getBalance()
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the balance:', error)
})
