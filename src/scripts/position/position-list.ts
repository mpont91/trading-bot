import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'
import { Position } from '../../domain/models/position'

export default async function (): Promise<void> {
  const positionService: PositionService = Container.getPositionService()
  const response: Position[] = await positionService.list()

  console.dir(response, { depth: null })
}
