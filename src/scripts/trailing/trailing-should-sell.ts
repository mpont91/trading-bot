import { Container } from '../../di'
import { TrailingService } from '../../domain/services/trailing-service'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const trailingService: TrailingService = Container.getTrailingService()
  const response: boolean | null = await trailingService.shouldSell(symbol)

  console.log(response)
}
