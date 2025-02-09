import { Container } from '../../di'
import { ApiFuturesService } from '../../domain/services/api-futures-service'

async function start(): Promise<void> {
  const bitmartApiService: ApiFuturesService = Container.getBitmartApiService()
  const symbol: string = process.argv[2]
  const leverage: string = process.argv[3]

  await bitmartApiService.setLeverage(symbol, parseInt(leverage))
}

start().catch((error: unknown): void => {
  console.error('Error setting the leverage:', error)
})
