import { Request, Response } from 'express'
import { Container } from '../../../di'
import { createErrorResponse } from '../helpers/response-helper'
import { TradeService } from '../../../domain/services/trade-service'
import { Trade } from '../../../domain/models/trade'

const tradeSpotService: TradeService = Container.getTradeSpotService()
const tradeFuturesService: TradeService = Container.getTradeFuturesService()

export function getLatestTradesSpot(
  request: Request,
  response: Response,
): Promise<void> {
  return getLatestTrades(request, response, tradeSpotService)
}

export function getLatestTradesFutures(
  request: Request,
  response: Response,
): Promise<void> {
  return getLatestTrades(request, response, tradeFuturesService)
}

async function getLatestTrades(
  request: Request,
  response: Response,
  tradeService: TradeService,
): Promise<void> {
  try {
    const trades: Trade[] = await tradeService.getLatest()

    response.json({ data: trades })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
