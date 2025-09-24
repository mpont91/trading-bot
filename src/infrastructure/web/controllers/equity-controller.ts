import { Request, Response } from 'express'
import { timeIntervalRule } from '../../../domain/types/time-interval'
import { Container } from '../../../di'
import { createErrorResponse } from '../helpers/response-helper'
import { EquityService } from '../../../domain/services/equity-service'
import { Equity } from '../../../domain/models/equity'

const equityService: EquityService = Container.getEquityService()

export async function getEquityGraph(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const interval = request.query.interval

    if (typeof interval !== 'string') {
      throw new Error('The "interval" parameter must be a single string.')
    }

    timeIntervalRule(interval)
    const equities: Equity[] = await equityService.graph(interval)

    response.json({ data: equities })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
