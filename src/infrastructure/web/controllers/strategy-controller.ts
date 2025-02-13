import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { Strategy } from '../../../domain/models/strategy'
import { StrategyService } from '../../../domain/services/strategy-service'

const strategyService: StrategyService = Container.getStrategyService()

export async function getStrategies(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const strategies: Strategy[] = await strategyService.getLatest()

    response.json({
      data: strategies,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
