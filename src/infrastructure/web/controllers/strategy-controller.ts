import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { Strategy } from '../../../domain/models/strategy'
import { StrategyService } from '../../../domain/services/strategy-service'
import { Signals } from '../../../domain/types/signals'
import { TimeInterval } from '../../../domain/types/time-interval'

const strategyService: StrategyService = Container.getStrategyService()

export async function getLastStrategies(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const symbol: string | undefined = request.params.symbol

    const strategies: Strategy[] = await strategyService.list(
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

    const opportunities: Strategy[] = await strategyService.listOpportunities(
      symbol?.toUpperCase(),
    )

    response.json({
      data: opportunities,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}

export async function getSignalsGraph(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const symbol: string = request.params.symbol.toUpperCase()
    const interval: TimeInterval = request.query.interval as TimeInterval

    const signals: Signals = await strategyService.signalsGraph(
      symbol,
      interval,
    )

    response.json({
      data: signals,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
