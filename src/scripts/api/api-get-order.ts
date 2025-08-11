import { Container } from '../../di'
import { OrderCreate } from '../../domain/models/order'
import { ApiService } from '../../domain/services/api-service'

async function start(): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const symbol: string = process.argv[2]
  const orderId: string = process.argv[3]

  const response: OrderCreate = await apiService.getOrder(symbol, orderId)
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the order:', error)
})
