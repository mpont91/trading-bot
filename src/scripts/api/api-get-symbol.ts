import { Container } from '../../di'
import { Symbol } from '../../domain/types/symbol'
import { ApiService } from '../../domain/services/api-service'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const apiService: ApiService = Container.getApiService()
  const response: Symbol = await apiService.getSymbol(symbol)

  console.dir(response, { depth: null })
}
