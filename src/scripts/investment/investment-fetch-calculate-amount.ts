import { Container } from '../../di'
import { InvestmentService } from '../../domain/services/investment-service'

export default async function (): Promise<void> {
  const investmentService: InvestmentService = Container.getInvestmentService()
  const response: number =
    await investmentService.fetchAndCalculateInvestmentAmount()

  console.log(response)
}
