import { Container } from '../../di'
import { CommissionEquityService } from '../../domain/services/commission-equity-service'
import { CommissionEquity } from '../../domain/models/commission-equity'

export default async function (): Promise<void> {
  const commissionEquityService: CommissionEquityService =
    Container.getCommissionEquityService()
  const response: CommissionEquity =
    await commissionEquityService.fetchAndCreate()

  console.dir(response, { depth: null })
}
