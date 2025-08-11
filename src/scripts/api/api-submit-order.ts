import { Container } from '../../di'
import { sideRule } from '../../application/rules/side-rule'
import { OrderRequest } from '../../domain/models/order'
import { Side } from '../../domain/types/side'
import { ApiService } from '../../domain/services/api-service'

async function start(): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const symbol: string = process.argv[2]
  const side: string = process.argv[3]
  const quantity: string = process.argv[4]

  sideRule(side)

  const orderRequest: OrderRequest = {
    symbol: symbol,
    side: side as Side,
    quantity: parseFloat(quantity),
  }

  await apiService.submitOrder(orderRequest)
}

start().catch((error: unknown): void => {
  console.error('Error submitting the order:', error)
})
