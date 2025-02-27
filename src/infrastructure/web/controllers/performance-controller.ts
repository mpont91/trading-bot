import { Request, Response } from 'express'
import { Container } from '../../../di'
import { PerformanceService } from '../../../domain/services/performance-service'
import { createErrorResponse } from '../helpers/response-helper'
import { Performance } from '../../../domain/types/performance'
import { PerformanceFullService } from '../../../domain/services/performance-full-service'
import { PerformanceServiceInterface } from '../../../domain/services/performance-service-interface'

const performanceSpotService: PerformanceService =
  Container.getPerformanceSpotService()
const performanceFuturesService: PerformanceService =
  Container.getPerformanceFuturesService()
const performanceFullService: PerformanceFullService =
  Container.getPerformanceFullService()

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

export function getPerformanceFull(
  request: Request,
  response: Response,
): Promise<void> {
  return getPerformance(request, response, performanceFullService)
}

async function getPerformance(
  request: Request,
  response: Response,
  performanceService: PerformanceServiceInterface,
): Promise<void> {
  try {
    const performance: Performance = await performanceService.getPerformance()
    response.json({ data: performance })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
