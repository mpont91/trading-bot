import { Container } from '../../di'
import { BinanceApiService } from '../../domain/services/binance-api-service'

async function start(): Promise<void> {
  const binanceApiService: BinanceApiService = Container.getBinanceApiService()
  const symbol: string = process.argv[2]
  const response: number = await binanceApiService.getStepSize(symbol)
  console.log(response)
}

start().catch((error: unknown): void => {
  console.error('Error getting the step size:', error)
})
