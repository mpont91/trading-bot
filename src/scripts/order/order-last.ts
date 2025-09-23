import { Container } from '../../di'
import { OrderService } from '../../domain/services/order-service'
import { Order } from '../../domain/models/order'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const orderService: OrderService = Container.getOrderService()
  const response: Order | null = await orderService.last(symbol)

  console.dir(response, { depth: null })
}
