import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'

async function start(): Promise<void> {
  const positionService: PositionService = Container.getPositionSpotService()
  const symbol: string = process.argv[2]
  await positionService.openPosition(symbol)
}

start().catch((error: unknown): void => {
  console.error(`Error opening the position:`, error)
})
