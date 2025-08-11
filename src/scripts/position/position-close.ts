import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'

async function start(): Promise<void> {
  const positionService: PositionService = Container.getPositionService()
  const symbol: string = process.argv[2]
  await positionService.closePosition(symbol)
}

start().catch((error: unknown): void => {
  console.error(`Error closing the position:`, error)
})
