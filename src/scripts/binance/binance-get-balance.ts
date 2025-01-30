import { Container } from '../../di'
import { Balance } from '../../domain/types/balance'
import { BinanceApiService } from '../../domain/services/binance-api-service'

async function start(): Promise<void> {
  const binanceApiService: BinanceApiService = Container.getBinanceApiService()
  const response: Balance = await binanceApiService.getBalance()
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the balance:', error)
})
