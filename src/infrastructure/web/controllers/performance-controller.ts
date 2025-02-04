import { Request, Response } from 'express'
import { Container } from '../../../di'
import { PerformanceService } from '../../../domain/services/performance-service'
import { createErrorResponse } from '../helpers/response-helper'
import { Performance } from '../../../domain/types/performance'

const performanceService: PerformanceService = Container.getPerformanceService()

export function getPerformanceSpot(request: Request, response: Response): void {
  return getPerformance(request, response)
}

export function getPerformanceFutures(
  request: Request,
  response: Response,
): void {
  return getPerformance(request, response)
}

function getPerformance(request: Request, response: Response): void {
  try {
    const performance: Performance = performanceService.getPerformance()
    response.json({ data: performance })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
