import { Container } from '../../di'
import { OrderService } from '../../domain/services/order-service'
import { Order } from '../../domain/models/order'

export default async function (args: string[]): Promise<void> {
  const [id] = args

  if (!id) {
    throw new Error('Missing required argument: id')
  }

  const orderService: OrderService = Container.getOrderService()
  const response: Order | null = await orderService.get(parseInt(id))

  console.dir(response, { depth: null })
}
