import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { Strategy } from '../../../domain/models/strategy'
import { StrategyService } from '../../../domain/services/strategy-service'
import { Signals } from '../../../domain/types/signals'
import { TimeInterval } from '../../../domain/types/time-interval'

const strategySpotService: StrategyService = Container.getStrategySpotService()
const strategyFuturesService: StrategyService =
  Container.getStrategyFuturesService()

export async function getLastStrategiesSpot(
  request: Request,
  response: Response,
): Promise<void> {
  return getLastStrategies(request, response, strategySpotService)
}

export async function getLastStrategiesFutures(
  request: Request,
  response: Response,
): Promise<void> {
  return getLastStrategies(request, response, strategyFuturesService)
}

export async function getLastOpportunitiesSpot(
  request: Request,
  response: Response,
): Promise<void> {
  return getLastOpportunities(request, response, strategySpotService)
}

export async function getLastOpportunitiesFutures(
  request: Request,
  response: Response,
): Promise<void> {
  return getLastOpportunities(request, response, strategyFuturesService)
}

export async function getSignalsGraphSpot(
  request: Request,
  response: Response,
): Promise<void> {
  return getSignalsGraph(request, response, strategySpotService)
}

export async function getSignalsGraphFutures(
  request: Request,
  response: Response,
): Promise<void> {
  return getSignalsGraph(request, response, strategyFuturesService)
}

async function getLastStrategies(
  request: Request,
  response: Response,
  strategyService: StrategyService,
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

async function getLastOpportunities(
  request: Request,
  response: Response,
  strategyService: StrategyService,
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

async function getSignalsGraph(
  request: Request,
  response: Response,
  strategyService: StrategyService,
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
