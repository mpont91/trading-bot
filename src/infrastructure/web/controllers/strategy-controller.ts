import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { StrategyAction } from '../../../domain/models/strategy-action'
import { StrategyActionService } from '../../../domain/services/strategy-action-service'
import { StrategyAnalysis } from '../../../domain/types/strategy-analysis'
import { timeIntervalRule } from '../../../domain/types/time-interval'

const strategyService: StrategyActionService = Container.getStrategyService()

export async function getLastStrategies(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const symbol: string | undefined = request.params.symbol

    const strategies: StrategyAction[] = await strategyService.list(
      symbol?.toUpperCase(),
    )

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
    const symbol: string | undefined = request.params.symbol

    const opportunities: StrategyAction[] =
      await strategyService.listOpportunities(symbol?.toUpperCase())

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
    const interval = request.query.interval

    if (typeof interval !== 'string') {
      throw new Error('The "interval" parameter must be a single string.')
    }

    timeIntervalRule(interval)

    const symbol: string = request.params.symbol.toUpperCase()

    const strategyAnalysis: StrategyAnalysis =
      await strategyService.getStrategyAnalysis(symbol, interval)

    response.json({
      data: strategyAnalysis,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
