import { Container } from '../../di'
import { DecisionService } from '../../domain/services/decision-service'
import { StrategyActionCreate } from '../../domain/models/strategy-action'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const decisionService: DecisionService = Container.getDecisionService()
  const response: StrategyActionCreate =
    await decisionService.fetchAndCalculate(symbol)

  console.dir(response, { depth: null })
}
