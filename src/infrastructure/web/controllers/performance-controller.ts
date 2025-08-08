import { Request, Response } from 'express'
import { Container } from '../../../di'
import { PerformanceService } from '../../../domain/services/performance-service'
import { createErrorResponse } from '../helpers/response-helper'
import { Performance } from '../../../domain/types/performance'

const performanceService: PerformanceService =
  Container.getPerformanceSpotService()

export async function getPerformance(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const performance: Performance = await performanceService.getPerformance()
    response.json({ data: performance })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
