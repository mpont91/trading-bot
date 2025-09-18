import { Container } from '../../di'
import { Balance } from '../../domain/types/balance'
import { ApiService } from '../../domain/services/api-service'

export default async function (): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const response: Balance = await apiService.getBalance()
  console.dir(response, { depth: null })
}
