import { Container } from '../../di'
import { IndicatorService } from '../../domain/services/indicator-service'
import { IndicatorList } from '../../domain/models/indicator'
import { z } from 'zod'
import { timeFrameSchema } from '../../domain/types/candle'

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

  const indicatorService: IndicatorService = Container.getIndicatorService()
  const response: IndicatorList =
    await indicatorService.fetchAndCalculateAndCreateAll(
      symbol,
      timeFrame,
      candles,
    )

  console.dir(response, { depth: null })
}
