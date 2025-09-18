import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'

export default async function (args: string[]): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const response: number = await apiService.getPrice(symbol)
  console.log(response)
}
