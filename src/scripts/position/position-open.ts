import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'
import { Position } from '../../domain/models/position'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const positionService: PositionService = Container.getPositionService()
  const response: Position = await positionService.openPosition(symbol)

  console.dir(response, { depth: null })
}
