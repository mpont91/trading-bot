import { Container } from '../../di'
import { InvestmentService } from '../../domain/services/investment-service'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const investmentService: InvestmentService = Container.getInvestmentService()
  const response: number =
    await investmentService.fetchAndCalculateInvestmentQuantity(symbol)

  console.log(response)
}
