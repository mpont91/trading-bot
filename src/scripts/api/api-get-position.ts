import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { Position } from '../../domain/types/position'

export default async function (args: string[]): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const response: Position | null = await apiService.getPosition(symbol)
  console.dir(response, { depth: null })
}
