import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'
import { Position } from '../../domain/types/position'

async function start(): Promise<void> {
  const positionService: PositionService = Container.getPositionSpotService()
  const symbol: string = process.argv[2]
  const response: Position | null = await positionService.getPosition(symbol)
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error(`Error getting the position:`, error)
})
