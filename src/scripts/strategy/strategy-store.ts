import { Container } from '../../di'
import { StrategyService } from '../../domain/services/strategy-service'
import { StrategyCreate } from '../../domain/models/strategy'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const strategyService: StrategyService = Container.getStrategyService()
  const response: StrategyCreate = await strategyService.store(symbol)

  console.dir(response, { depth: null })
}
