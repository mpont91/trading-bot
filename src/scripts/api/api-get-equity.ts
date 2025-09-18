import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { EquityCreate } from '../../domain/models/equity'

export default async function (): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const response: EquityCreate = await apiService.getEquity()
  console.dir(response, { depth: null })
}
