import { Container } from '../../di'
import { TrailingService } from '../../domain/services/trailing-service'
import { Trailing } from '../../domain/models/trailing'

async function start(): Promise<void> {
  const trailingService: TrailingService = Container.getTrailingService()
  const response: Trailing[] | null = await trailingService.list()
  console.dir(response, { depth: null })
}

start().catch((error: unknown): void => {
  console.error(`Error getting the trailing list:`, error)
})
