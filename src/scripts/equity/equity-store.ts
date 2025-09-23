import { Container } from '../../di'
import { EquityService } from '../../domain/services/equity-service'
import { Equity } from '../../domain/models/equity'

export default async function (): Promise<void> {
  const equityService: EquityService = Container.getEquityService()
  const response: Equity = await equityService.store()

  console.dir(response, { depth: null })
}
