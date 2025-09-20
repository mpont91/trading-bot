import { Container } from '../../di'
import { IndicatorService } from '../../domain/services/indicator-service'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const indicatorService: IndicatorService = Container.getIndicatorService()
  await indicatorService.storeAll(symbol)

  console.log('Indicators stored successfully!')
}
