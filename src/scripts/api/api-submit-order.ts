import { Container } from '../../di'
import { sideRule } from '../../application/rules/side-rule'
import { OrderRequest } from '../../domain/models/order'
import { Side } from '../../domain/types/side'
import { ApiService } from '../../domain/services/api-service'

export default async function (args: string[]): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const [symbol, side, quantity] = args

  if (!symbol || !side || !quantity) {
    throw new Error('Missing required arguments: symbol or side or quantity')
  }

  sideRule(side)

  const orderRequest: OrderRequest = {
    symbol: symbol,
    side: side as Side,
    quantity: parseFloat(quantity),
  }

  await apiService.submitOrder(orderRequest)

  console.log('Order submitted successfully!')
}
