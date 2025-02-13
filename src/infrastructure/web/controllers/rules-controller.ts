import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { IndicatorsRulesSettings } from '../../../domain/types/settings'
import { settings } from '../../../application/settings'

export async function getRules(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const rules: IndicatorsRulesSettings = settings.indicators.rules

    response.json({
      data: rules,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
