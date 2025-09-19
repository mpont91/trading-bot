import { Container } from '../../di'
import { InvestmentService } from '../../domain/services/investment-service'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const investmentService: InvestmentService = Container.getInvestmentService()
  const response: number =
    await investmentService.getInvestmentQuantityFromSymbol(symbol)

  console.log(response)
}
