import { Container } from '../../di'
import { sideRule } from '../../application/rules/side-rule'
import { ApiSpotService } from '../../domain/services/api-spot-service'
import { OrderSpotRequest } from '../../domain/models/order'
import { Side } from '../../domain/types/side'

async function start(): Promise<void> {
  const binanceApiService: ApiSpotService = Container.getBinanceApiService()
  const symbol: string = process.argv[2]
  const side: string = process.argv[3]
  const quantity: string = process.argv[4]

  sideRule(side)

  const orderRequest: OrderSpotRequest = {
    symbol: symbol,
    side: side as Side,
    quantity: parseFloat(quantity),
  }

  await binanceApiService.submitOrder(orderRequest)
}

start().catch((error: unknown): void => {
  console.error('Error submitting the order:', error)
})
