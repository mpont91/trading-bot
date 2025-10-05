import { Container } from '../../di'
import { StrategyActionService } from '../../domain/services/strategy-action-service'
import { StrategyAction } from '../../domain/models/strategy-action'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const strategyService: StrategyActionService = Container.getStrategyService()
  const response: StrategyAction =
    await strategyService.calculateAndCreate(symbol)

  console.dir(response, { depth: null })
}
