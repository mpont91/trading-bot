import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { IndicatorService } from '../../../domain/services/indicator-service'
import { Indicator } from '../../../domain/models/indicator'

const indicatorService: IndicatorService = Container.getIndicatorService()

export async function getIndicators(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const indicators: Indicator[] = await indicatorService.getLatest()

    response.json({
      data: indicators,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
