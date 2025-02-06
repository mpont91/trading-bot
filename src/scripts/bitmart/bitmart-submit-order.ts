import { Container } from '../../di'
import { sideRule } from '../../application/rules/side-rule'
import { BitmartApiService } from '../../domain/services/bitmart-api-service'
import { OrderFuturesRequest } from '../../domain/models/order'
import { Side } from '../../domain/types/side'

async function start(): Promise<void> {
  const bitmartApiService: BitmartApiService = Container.getBitmartApiService()
  const symbol: string = process.argv[2]
  const side: string = process.argv[3]
  const quantity: string = process.argv[4]
  const leverage: string = process.argv[5]
  const isClosePosition: string = process.argv[6]

  sideRule(side)

  const orderRequest: OrderFuturesRequest = {
    type: 'futures',
    symbol: symbol,
    side: side as Side,
    quantity: parseFloat(quantity),
    leverage: parseInt(leverage),
    isClosePosition: isClosePosition === 'true',
  }

  await bitmartApiService.submitOrder(orderRequest)
}

start().catch((error: unknown): void => {
  console.error('Error submitting the order:', error)
})
