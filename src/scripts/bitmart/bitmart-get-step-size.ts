import { Container } from '../../di'
import { BitmartApiService } from '../../domain/services/bitmart-api-service'

async function start(): Promise<void> {
  const bitmartApiService: BitmartApiService = Container.getBitmartApiService()
  const symbol: string = process.argv[2]
  const response: number = await bitmartApiService.getStepSize(symbol)
  console.log(response)
}

start().catch((error: unknown): void => {
  console.error('Error getting the step size:', error)
})
