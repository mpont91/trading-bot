import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { Candle } from '../../domain/types/candle'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const apiService: ApiService = Container.getApiService()
  const response: Candle[] = await apiService.getCandles(symbol)

  console.dir(response, { depth: null })
}
