import { Container } from '../../di'
import { Symbol } from '../../domain/types/symbol'
import { ApiService } from '../../domain/services/api-service'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const apiService: ApiService = Container.getApiService()
  const response: Symbol = await apiService.getSymbol(symbol)

  console.dir(response, { depth: null })
}
