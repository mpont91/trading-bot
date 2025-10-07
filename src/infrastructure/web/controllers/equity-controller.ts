import { Request, Response } from 'express'
import { TimeInterval } from '../../../domain/types/time-interval'
import { Container } from '../../../di'
import { createErrorResponse } from '../helpers/response-helper'
import { EquityService } from '../../../domain/services/equity-service'
import { Equity } from '../../../domain/models/equity'
import { getEquityGraphSchema } from '../validators/equity-request-schema'

const equityService: EquityService = Container.getEquityService()

export async function getEquityGraph(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const { query } = getEquityGraphSchema.parse(request)

    const interval: TimeInterval = query.interval
    const equities: Equity[] = await equityService.graph(interval)

    response.json({ data: equities })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
