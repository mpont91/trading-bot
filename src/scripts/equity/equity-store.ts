import { Container } from '../../di'
import { EquityService } from '../../domain/services/equity-service'

export default async function (): Promise<void> {
  const equityService: EquityService = Container.getEquityService()
  await equityService.store()

  console.log('Equity stored successfully!')
}
