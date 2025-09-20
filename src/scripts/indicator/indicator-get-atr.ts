import { Container } from '../../di'
import { IndicatorService } from '../../domain/services/indicator-service'
import { IndicatorATR } from '../../domain/models/indicator'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const indicatorService: IndicatorService = Container.getIndicatorService()
  const response: IndicatorATR | null = await indicatorService.getATR(symbol)

  console.dir(response, { depth: null })
}
