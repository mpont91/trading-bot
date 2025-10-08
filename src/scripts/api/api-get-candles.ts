import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { Candle, timeFrameSchema } from '../../domain/types/candle'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string(),
  timeFrame: z.coerce.number().pipe(timeFrameSchema),
  candles: z.coerce.number().int(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest, timeFrameRequest, candlesRequest] = args

  const { symbol, timeFrame, candles } = requestSchema.parse({
    symbol: symbolRequest,
    timeFrame: timeFrameRequest,
    candles: candlesRequest,
  })

  const apiService: ApiService = Container.getApiService()
  const response: Candle[] = await apiService.getCandles(
    symbol,
    timeFrame,
    candles,
  )

  console.dir(response, { depth: null })
}
