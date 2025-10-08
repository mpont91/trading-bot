import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'
import { Position } from '../../domain/models/position'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const positionService: PositionService = Container.getPositionService()
  const response: Position | null = await positionService.get(symbol)

  console.dir(response, { depth: null })
}
