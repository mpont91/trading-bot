import { Request, Response } from 'express'
import { Container } from '../../../di'
import { PerformanceService } from '../../../domain/services/performance-service'
import { createErrorResponse } from '../helpers/response-helper'
import { Performance } from '../../../domain/types/performance'

const performanceSpotService: PerformanceService =
  Container.getPerformanceSpotService()
const performanceFuturesService: PerformanceService =
  Container.getPerformanceFuturesService()

export function getPerformanceSpot(
  request: Request,
  response: Response,
): Promise<void> {
  return getPerformance(request, response, performanceSpotService)
}

export function getPerformanceFutures(
  request: Request,
  response: Response,
): Promise<void> {
  return getPerformance(request, response, performanceFuturesService)
}

async function getPerformance(
  request: Request,
  response: Response,
  performanceService: PerformanceService,
): Promise<void> {
  try {
    const performance: Performance = await performanceService.getPerformance()
    response.json({ data: performance })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
