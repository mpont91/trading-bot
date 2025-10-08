import { Container } from '../../di'
import { OrderService } from '../../domain/services/order-service'
import { Order } from '../../domain/models/order'
import { z } from 'zod'

const requestSchema = z.object({
  id: z.coerce.number().int(),
})

export default async function (args: string[]): Promise<void> {
  const [idRequest] = args

  const { id } = requestSchema.parse({
    symbol: idRequest,
  })

  const orderService: OrderService = Container.getOrderService()
  const response: Order | null = await orderService.get(id)

  console.dir(response, { depth: null })
}
