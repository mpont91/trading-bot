import { Container } from '../../di'
import { OrderService } from '../../domain/services/order-service'
import { Order } from '../../domain/models/order'

export default async function (): Promise<void> {
  const orderService: OrderService = Container.getOrderService()
  const response: Order[] | null = await orderService.getLastMany()

  console.dir(response, { depth: null })
}
