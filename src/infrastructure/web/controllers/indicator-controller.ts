import { Request, Response } from 'express'
import { timeIntervalRule } from '../../../domain/types/time-interval'
import { Container } from '../../../di'
import { createErrorResponse } from '../helpers/response-helper'
import { IndicatorService } from '../../../domain/services/indicator-service'
import { IndicatorSMA } from '../../../domain/models/indicator'

const indicatorService: IndicatorService = Container.getIndicatorService()

export async function getGraphSMA(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const interval = request.query.interval

    if (typeof interval !== 'string') {
      throw new Error('The "interval" parameter must be a single string.')
    }

    timeIntervalRule(interval)

    const symbol: string = request.params.symbol.toUpperCase()

    const sma: IndicatorSMA[] = await indicatorService.getGraphSMA(
      symbol,
      interval,
    )

    response.json({ data: sma })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
