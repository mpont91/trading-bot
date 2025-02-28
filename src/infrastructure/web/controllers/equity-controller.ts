import { Request, Response } from 'express'
import type { TimeInterval } from '../../../domain/types/time-interval'
import { Container } from '../../../di'
import { createErrorResponse } from '../helpers/response-helper'
import { timeIntervalRule } from '../../../application/rules/time-interval-rule'
import { EquityService } from '../../../domain/services/equity-service'
import { Equity } from '../../../domain/models/equity'
import { EquityFullService } from '../../../domain/services/equity-full-service'
import { EquityServiceInterface } from '../../../domain/services/equity-service-interface'

const equitySpotService: EquityService = Container.getEquitySpotService()
const equityFuturesService: EquityService = Container.getEquityFuturesService()
const equityFullService: EquityFullService = Container.getEquityFullService()

export function getEquitySpotGraph(
  request: Request,
  response: Response,
): Promise<void> {
  return getEquityGraph(request, response, equitySpotService)
}

export function getEquityFuturesGraph(
  request: Request,
  response: Response,
): Promise<void> {
  return getEquityGraph(request, response, equityFuturesService)
}

export function getEquityFullGraph(
  request: Request,
  response: Response,
): Promise<void> {
  return getEquityGraph(request, response, equityFullService)
}

async function getEquityGraph(
  request: Request,
  response: Response,
  equityService: EquityServiceInterface,
): Promise<void> {
  try {
    timeIntervalRule(request.query.interval as string)

    const interval: TimeInterval = request.query.interval as TimeInterval
    const equities: Equity[] = await equityService.graph(interval)

    response.json({ data: equities })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
