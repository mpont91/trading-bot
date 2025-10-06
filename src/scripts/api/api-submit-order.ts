import { Container } from '../../di'
import { OrderRequest } from '../../domain/models/order'
import { sideSchema } from '../../domain/types/side'
import { ApiService } from '../../domain/services/api-service'
import { z } from 'zod'

export default async function (args: string[]): Promise<void> {
  const inputSchema = z.object({
    symbol: z.string(),
    side: sideSchema,
    quantity: z.coerce.number(),
  })

  const [symbol, side, quantity] = args

  const orderRequest: OrderRequest = inputSchema.parse({
    symbol,
    side,
    quantity,
  })

  const apiService: ApiService = Container.getApiService()

  await apiService.submitOrder(orderRequest)

  console.log('Order submitted successfully!')
}
