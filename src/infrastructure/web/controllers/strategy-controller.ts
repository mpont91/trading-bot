import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { Strategy } from '../../../domain/models/strategy'
import { StrategyService } from '../../../domain/services/strategy-service'

const strategyService: StrategyService = Container.getStrategyService()

export async function getLastStrategies(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const strategies: Strategy[] =
      await strategyService.getLastManyForEachSymbol()

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
    const opportunities: Strategy[] =
      await strategyService.getLastManyOpportunitiesForEachSymbol()

    response.json({
      data: opportunities,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
