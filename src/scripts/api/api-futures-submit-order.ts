import { Container } from '../../di'
import { sideRule } from '../../application/rules/side-rule'
import { OrderFuturesRequest } from '../../domain/models/order'
import { Side } from '../../domain/types/side'
import { ApiService } from '../../domain/services/api-service'

async function start(): Promise<void> {
  const apiService: ApiService = Container.getApiFuturesService()
  const symbol: string = process.argv[2]
  const side: string = process.argv[3]
  const quantity: string = process.argv[4]
  const leverage: string = process.argv[5]
  const isClosePosition: string = process.argv[6]

  sideRule(side)

  const orderRequest: OrderFuturesRequest = {
    symbol: symbol,
    side: side as Side,
    quantity: parseFloat(quantity),
    leverage: parseInt(leverage),
    isClosePosition: isClosePosition === 'true',
  }

  await apiService.submitOrder(orderRequest)
}

start().catch((error: unknown): void => {
  console.error('Error submitting the order:', error)
})
