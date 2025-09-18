import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { CommissionEquityCreate } from '../../domain/models/commission-equity'

export default async function (): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const response: CommissionEquityCreate =
    await apiService.getCommissionEquity()
  console.dir(response, { depth: null })
}
