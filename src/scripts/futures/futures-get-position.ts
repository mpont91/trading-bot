import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'
import { Position } from '../../domain/types/position'

async function start(): Promise<void> {
  const positionFuturesService: PositionService =
    Container.getPositionFuturesService()
  const symbol: string = process.argv[2]
  const response: Position | null =
    await positionFuturesService.getPosition(symbol)
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error(`Error getting the position:`, error)
})
