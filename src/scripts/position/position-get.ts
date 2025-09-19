import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'
import { Position } from '../../domain/types/position'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const positionService: PositionService = Container.getPositionService()
  const response: Position | null = await positionService.getPosition(symbol)

  console.dir(response, { depth: null })
}
