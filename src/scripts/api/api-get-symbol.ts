import { Container } from '../../di'
import { Symbol } from '../../domain/types/symbol'
import { ApiService } from '../../domain/services/api-service'

async function start(): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const symbol: string = process.argv[2]
  const response: Symbol = await apiService.getSymbol(symbol)
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the symbol:', error)
})
