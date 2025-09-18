import { Container } from '../../di'
import { OrderCreate } from '../../domain/models/order'
import { ApiService } from '../../domain/services/api-service'

export default async function (args: string[]): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const [symbol, orderId] = args

  if (!symbol || !orderId) {
    throw new Error('Missing required arguments: symbol or orderId')
  }

  const response: OrderCreate = await apiService.getOrder(symbol, orderId)
  console.dir(response, { depth: null })
}
