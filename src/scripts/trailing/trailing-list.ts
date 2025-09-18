import { Container } from '../../di'
import { TrailingService } from '../../domain/services/trailing-service'
import { Trailing } from '../../domain/models/trailing'

export default async function (): Promise<void> {
  const trailingService: TrailingService = Container.getTrailingService()
  const response: Trailing[] | null = await trailingService.list()
  console.dir(response, { depth: null })
}
