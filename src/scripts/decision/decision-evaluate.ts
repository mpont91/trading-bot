import { Container } from '../../di'
import { DecisionService } from '../../domain/services/decision-service'
import { StrategyCreate } from '../../domain/models/strategy'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const decisionService: DecisionService = Container.getDecisionService()
  const response: StrategyCreate = await decisionService.evaluate(symbol)

  console.dir(response, { depth: null })
}
