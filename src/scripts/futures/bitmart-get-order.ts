import { Container } from '../../di'
import { ApiFuturesService } from '../../domain/services/api-futures-service'
import { OrderCreate } from '../../domain/models/order'

async function start(): Promise<void> {
  const bitmartApiService: ApiFuturesService = Container.getBitmartApiService()
  const symbol: string = process.argv[2]
  const orderId: string = process.argv[3]

  const response: OrderCreate = await bitmartApiService.getOrder(
    symbol,
    orderId,
  )
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the order:', error)
})
