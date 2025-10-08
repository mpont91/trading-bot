import { Container } from '../../di'
import { PositionService } from '../../domain/services/position-service'
import { Order } from '../../domain/models/order'
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
  const response: Order = await positionService.closePosition(symbol)

  console.dir(response, { depth: null })
}
