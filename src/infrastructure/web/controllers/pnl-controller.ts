import { Request, Response } from 'express'
import type { TimeInterval } from '../../../domain/types/time-interval'
import { Container } from '../../../di'
import { createErrorResponse } from '../helpers/response-helper'
import { timeIntervalRule } from '../../../application/rules/time-interval-rule'
import { PnlService } from '../../../domain/services/pnl-service'
import { Pnl } from '../../../domain/models/pnl'

const pnlService: PnlService = Container.getPnlService()

export async function getPnlGraph(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    timeIntervalRule(request.query.interval as string)

    const interval: TimeInterval = request.query.interval as TimeInterval
    const pnl: Pnl[] = await pnlService.graph(interval)

    response.json({ data: pnl })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
