import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { StrategyActionService } from '../../../domain/services/strategy-action-service'
import { StrategyAnalysis } from '../../../domain/types/strategy-analysis'
import { TimeInterval } from '../../../domain/types/time-interval'
import { getStrategyAnalysisSchema } from '../validators/strategy-request-schema'

const strategyActionService: StrategyActionService =
  Container.getStrategyActionService()

export async function getStrategyAnalysis(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const { query, params } = getStrategyAnalysisSchema.parse(request)

    const interval: TimeInterval = query.interval
    const symbol: string = params.symbol

    const strategyAnalysis: StrategyAnalysis =
      await strategyActionService.getStrategyAnalysis(symbol, interval)

    response.json({
      data: strategyAnalysis,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
