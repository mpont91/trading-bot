import { Container } from '../../di'
import { TrailingService } from '../../domain/services/trailing-service'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const trailingService: TrailingService = Container.getTrailingService()
  const response: boolean | null = await trailingService.shouldSell(symbol)

  console.log(response)
}
