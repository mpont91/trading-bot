import fs from 'fs'
import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { Kline, KlineInterval } from '../../domain/types/kline'
import { settings } from '../../application/settings'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const apiService: ApiService = Container.getApiService()

  const start: Date = new Date('2024-01-01T00:00:00Z')
  const end: Date = new Date('2024-01-07T23:59:59Z')
  const klineInterval: KlineInterval = settings.history.klineHistoryInterval

  const response: Kline[] = await apiService.getKlineHistorical(
    symbol,
    klineInterval,
    start,
    end,
  )

  const filename = `./data/${symbol.toLowerCase()}.json`
  fs.writeFileSync(filename, JSON.stringify(response))

  console.log(`${response.length} candles saved to ${filename}`)
}
