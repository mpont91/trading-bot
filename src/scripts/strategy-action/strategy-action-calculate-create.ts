import { Container } from '../../di'
import { StrategyActionService } from '../../domain/services/strategy-action-service'
import { StrategyAction } from '../../domain/models/strategy-action'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const strategyActionService: StrategyActionService =
    Container.getStrategyActionService()
  const response: StrategyAction =
    await strategyActionService.calculateAndCreate(symbol)

  console.dir(response, { depth: null })
}
