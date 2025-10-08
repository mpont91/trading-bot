import { Container } from '../../di'
import { IndicatorService } from '../../domain/services/indicator-service'
import { IndicatorList } from '../../domain/models/indicator'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const indicatorService: IndicatorService = Container.getIndicatorService()
  const response: IndicatorList | null = await indicatorService.getAll(symbol)

  console.dir(response, { depth: null })
}
