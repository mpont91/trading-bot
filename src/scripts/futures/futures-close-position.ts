import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'

async function start(): Promise<void> {
  const positionFuturesService: PositionService =
    Container.getPositionFuturesService()
  const symbol: string = process.argv[2]
  await positionFuturesService.closePosition(symbol)
}

start().catch((error: unknown): void => {
  console.error(`Error closing the position:`, error)
})
