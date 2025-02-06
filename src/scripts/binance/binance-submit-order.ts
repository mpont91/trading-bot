import { Container } from '../../di'
import { sideRule } from '../../application/rules/side-rule'
import { BinanceApiService } from '../../domain/services/binance-api-service'
import { OrderSpotRequest } from '../../domain/models/order'
import { Side } from '../../domain/types/side'

async function start(): Promise<void> {
  const binanceApiService: BinanceApiService = Container.getBinanceApiService()
  const symbol: string = process.argv[2]
  const side: string = process.argv[3]
  const quantity: string = process.argv[4]

  sideRule(side)

  const orderRequest: OrderSpotRequest = {
    type: 'spot',
    symbol: symbol,
    side: side as Side,
    quantity: parseFloat(quantity),
  }

  await binanceApiService.submitOrder(orderRequest)
}

start().catch((error: unknown): void => {
  console.error('Error submitting the order:', error)
})
