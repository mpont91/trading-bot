import { Container } from '../../di'
import { BitmartApiService } from '../../domain/services/bitmart-api-service'
import { Symbol } from '../../domain/types/symbol'

async function start(): Promise<void> {
  const bitmartApiService: BitmartApiService = Container.getBitmartApiService()
  const symbol: string = process.argv[2]
  const response: Symbol = await bitmartApiService.getSymbol(symbol)
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error('Error getting the symbol:', error)
})
