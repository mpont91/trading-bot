import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'

export default async function (args: string[]): Promise<void> {
  const positionService: PositionService = Container.getPositionService()
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  await positionService.closePosition(symbol)

  console.log('Position closed successfully!')
}
