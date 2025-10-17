import { Request, Response } from 'express'
import { Container } from '../../../di'
import { PerformanceService } from '../../../domain/services/performance-service'
import { createErrorResponse } from '../helpers/response-helper'
import { Performance } from '../../../domain/types/performance'
import { getPerformanceSchema } from '../validators/performance-request-schema'

const performanceService: PerformanceService = Container.getPerformanceService()

export async function getPerformance(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const { params } = getPerformanceSchema.parse(request)
    const symbol: string | undefined = params.symbol

    const performance: Performance =
      await performanceService.getPerformance(symbol)

    response.json({ data: performance })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
