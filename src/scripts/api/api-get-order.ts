import { Container } from '../../di'
import { OrderCreate } from '../../domain/models/order'
import { ApiService } from '../../domain/services/api-service'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string(),
  orderId: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest, orderIdRequest] = args

  const { symbol, orderId } = requestSchema.parse({
    symbol: symbolRequest,
    orderId: orderIdRequest,
  })

  const apiService: ApiService = Container.getApiService()
  const response: OrderCreate = await apiService.getOrder(symbol, orderId)

  console.dir(response, { depth: null })
}
