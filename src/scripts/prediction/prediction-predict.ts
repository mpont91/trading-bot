import { Container } from '../../di'
import { PredictionService } from '../../domain/services/prediction-service'
import { HOLD, Strategy } from '../../domain/types/strategy'

async function start(): Promise<void> {
  const predictionService: PredictionService = Container.getPredictionService()
  const symbol: string = process.argv[2]

  const response: Strategy | HOLD = await predictionService.predict(symbol)

  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error(`Error getting the prediction:`, error)
})
