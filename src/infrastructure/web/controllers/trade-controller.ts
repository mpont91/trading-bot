import { Request, Response } from 'express'
import { Container } from '../../../di'
import { createErrorResponse } from '../helpers/response-helper'
import { TradeService } from '../../../domain/services/trade-service'
import { Trade } from '../../../domain/models/trade'

const tradeService: TradeService = Container.getTradeService()

export async function getLastTrades(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const symbol: string | undefined = request.params.symbol

    const trades: Trade[] = symbol
      ? await tradeService.getLastManyForSymbol(symbol.toUpperCase())
      : await tradeService.getLastMany()

    response.json({ data: trades })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
