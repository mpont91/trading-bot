import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'

export default async function (args: string[]): Promise<void> {
  const positionService: PositionService = Container.getPositionService()
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  await positionService.openPosition(symbol)

  console.log('Position opened successfully!')
}
