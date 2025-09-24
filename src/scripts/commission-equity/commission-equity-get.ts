import { Container } from '../../di'
import { CommissionEquity } from '../../domain/models/commission-equity'
import { CommissionEquityService } from '../../domain/services/commission-equity-service'

export default async function (): Promise<void> {
  const commissionEquityService: CommissionEquityService =
    Container.getCommissionEquityService()
  const response: CommissionEquity | null = await commissionEquityService.get()

  console.dir(response, { depth: null })
}
