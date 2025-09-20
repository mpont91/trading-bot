import { Container } from '../../di'
import { IndicatorService } from '../../domain/services/indicator-service'
import { IndicatorBB } from '../../domain/models/indicator'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const indicatorService: IndicatorService = Container.getIndicatorService()
  const response: IndicatorBB | null = await indicatorService.getBB(symbol)

  console.dir(response, { depth: null })
}
