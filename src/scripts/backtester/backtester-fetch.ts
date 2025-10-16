import fs from 'fs'
import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { Candle, timeFrameSchema } from '../../domain/types/candle'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string().transform((s) => s.toUpperCase()),
  timeFrame: z.coerce.number().pipe(timeFrameSchema),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest, timeFrameRequest] = args

  const { symbol, timeFrame } = requestSchema.parse({
    symbol: symbolRequest,
    timeFrame: timeFrameRequest,
  })

  const apiService: ApiService = Container.getApiService()

  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 1)
  end.setUTCHours(23, 59, 59, 999)

  const start = new Date(end)
  start.setUTCFullYear(start.getUTCFullYear() - 1)
  start.setUTCHours(0, 0, 0, 0)

  const response: Candle[] = await apiService.getCandlesHistorical(
    symbol,
    timeFrame,
    start,
    end,
  )

  const filename = `./data/${symbol}-${timeFrame}.json`
  fs.writeFileSync(filename, JSON.stringify(response))

  console.log(`${response.length} candles saved to ${filename}`)
}
