import { Container } from '../../di'
import { ApiSpotService } from '../../domain/services/api-spot-service'
import { OrderCreate } from '../../domain/models/order'

async function start(): Promise<void> {
  const binanceApiService: ApiSpotService = Container.getBinanceApiService()
  const symbol: string = process.argv[2]
  const orderId: string = process.argv[3]

  const response: OrderCreate = await binanceApiService.getOrder(
    symbol,
    orderId,
  )
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the order:', error)
})
