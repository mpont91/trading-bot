import fs from 'fs'
import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { Candle, timeFrameSchema } from '../../domain/types/candle'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string().transform((s) => s.toLowerCase()),
  timeFrame: z.coerce.number().pipe(timeFrameSchema),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest, timeFrameRequest] = args

  const { symbol, timeFrame } = requestSchema.parse({
    symbol: symbolRequest,
    timeFrame: timeFrameRequest,
  })

  const apiService: ApiService = Container.getApiService()

  const start: Date = new Date('2024-01-01T00:00:00Z')
  const end: Date = new Date('2024-12-31T23:59:59Z')

  const response: Candle[] = await apiService.getCandlesHistorical(
    symbol,
    timeFrame,
    start,
    end,
  )

  const filename = `./data/${symbol}.json`
  fs.writeFileSync(filename, JSON.stringify(response))

  console.log(`${response.length} candles saved to ${filename}`)
}
