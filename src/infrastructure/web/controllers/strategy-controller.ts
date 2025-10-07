import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { StrategyAction } from '../../../domain/models/strategy-action'
import { StrategyActionService } from '../../../domain/services/strategy-action-service'
import { StrategyAnalysis } from '../../../domain/types/strategy-analysis'
import { TimeInterval } from '../../../domain/types/time-interval'
import {
  getLastOpportunitiesSchema,
  getLastStrategiesSchema,
  getStrategyAnalysisSchema,
} from '../validators/strategy-request-schema'

const strategyActionService: StrategyActionService =
  Container.getStrategyActionService()

export async function getLastStrategies(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const { params } = getLastStrategiesSchema.parse(request)

    const symbol: string | undefined = params.symbol

    const strategies: StrategyAction[] =
      await strategyActionService.list(symbol)

    response.json({
      data: strategies,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}

export async function getLastOpportunities(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const { params } = getLastOpportunitiesSchema.parse(request)

    const symbol: string | undefined = params.symbol

    const opportunities: StrategyAction[] =
      await strategyActionService.listOpportunities(symbol)

    response.json({
      data: opportunities,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}

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
