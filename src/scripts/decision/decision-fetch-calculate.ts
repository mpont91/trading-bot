import { Container } from '../../di'
import { StrategyReportService } from '../../domain/services/strategy-report-service'
import { StrategyActionCreate } from '../../domain/models/strategy-action'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const decisionService: StrategyReportService = Container.getDecisionService()
  const response: StrategyActionCreate =
    await decisionService.fetchAndCalculate(symbol)

  console.dir(response, { depth: null })
}
