import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { Strategy } from '../../../domain/models/strategy'
import { StrategyService } from '../../../domain/services/strategy-service'
import { Signals } from '../../../domain/types/signals'
import { TimeInterval } from '../../../domain/types/time-interval'

const strategyService: StrategyService = Container.getStrategySpotService()

export async function getLastStrategies(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const symbol: string | undefined = request.params.symbol

    const strategies: Strategy[] = symbol
      ? await strategyService.getLastManyForSymbol(symbol.toUpperCase())
      : await strategyService.getLastManyForEachSymbol()

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

    const opportunities: Strategy[] = symbol
      ? await strategyService.getLastManyOpportunitiesForSymbol(
          symbol.toUpperCase(),
        )
      : await strategyService.getLastManyOpportunitiesForEachSymbol()

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
