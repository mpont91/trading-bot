import { Container } from '../../di'
import { ApiSpotService } from '../../domain/services/api-spot-service'
import { Symbol } from '../../domain/types/symbol'

async function start(): Promise<void> {
  const binanceApiService: ApiSpotService = Container.getBinanceApiService()
  const symbol: string = process.argv[2]
  const response: Symbol = await binanceApiService.getSymbol(symbol)
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the symbol:', error)
})
