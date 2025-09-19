import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { Kline } from '../../domain/types/kline'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const apiService: ApiService = Container.getApiService()
  const response: Kline[] = await apiService.getKline(symbol)

  console.dir(response, { depth: null })
}
