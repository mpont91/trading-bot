import { Container } from '../../di'
import { EquityService } from '../../domain/services/equity-service'
import { timeIntervalRule } from '../../domain/types/time-interval'
import { Equity } from '../../domain/models/equity'

export default async function (args: string[]): Promise<void> {
  const [timeInterval] = args

  timeIntervalRule(timeInterval)

  const equityService: EquityService = Container.getEquityService()
  const response: Equity[] = await equityService.graph(timeInterval)

  console.dir(response, { depth: null })
}
