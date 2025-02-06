import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'

async function start(): Promise<void> {
  const positionSpotService: PositionService =
    Container.getPositionSpotService()
  const symbol: string = process.argv[2]
  await positionSpotService.closePosition(symbol)
}

start().catch((error: unknown): void => {
  console.error(`Error closing the position:`, error)
})
