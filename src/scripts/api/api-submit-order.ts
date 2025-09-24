import { Container } from '../../di'
import { OrderRequest } from '../../domain/models/order'
import { sideRule } from '../../domain/types/side'
import { ApiService } from '../../domain/services/api-service'

export default async function (args: string[]): Promise<void> {
  const [symbol, side, quantity] = args

  if (!symbol || !side || !quantity) {
    throw new Error('Missing required arguments: symbol or side or quantity')
  }

  sideRule(side)

  const apiService: ApiService = Container.getApiService()
  const orderRequest: OrderRequest = {
    symbol: symbol,
    side: side,
    quantity: parseFloat(quantity),
  }
  await apiService.submitOrder(orderRequest)

  console.log('Order submitted successfully!')
}
