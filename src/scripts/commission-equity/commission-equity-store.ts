import { Container } from '../../di'
import { CommissionEquityService } from '../../domain/services/commission-equity-service'

export default async function (): Promise<void> {
  const commissionEquityService: CommissionEquityService =
    Container.getCommissionEquityService()
  await commissionEquityService.store()

  console.log('Commission equity stored successfully!')
}
