import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'
import { Order } from '../../domain/models/order'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const positionService: PositionService = Container.getPositionService()
  const response: Order = await positionService.closePosition(symbol)

  console.dir(response, { depth: null })
}
