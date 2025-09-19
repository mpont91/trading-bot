import { Container } from '../../di'
import { Performance } from '../../domain/types/performance'
import { PerformanceService } from '../../domain/services/performance-service'

export default async function (): Promise<void> {
  const performanceService: PerformanceService =
    Container.getPerformanceService()
  const response: Performance | null = await performanceService.getPerformance()

  console.dir(response, { depth: null })
}
