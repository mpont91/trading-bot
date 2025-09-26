import { Request, Response } from 'express'
import { timeIntervalRule } from '../../../domain/types/time-interval'
import { Container } from '../../../di'
import { createErrorResponse } from '../helpers/response-helper'
import { IndicatorService } from '../../../domain/services/indicator-service'
import {
  IndicatorADX,
  IndicatorATR,
  IndicatorBB,
  IndicatorName,
  indicatorNameRule,
  IndicatorRSI,
  IndicatorSMA,
  IndicatorSMACross,
} from '../../../domain/models/indicator'

const indicatorService: IndicatorService = Container.getIndicatorService()

export async function getGraphIndicator(
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
    const indicator: string = request.params.indicator.toLowerCase()

    indicatorNameRule(indicator)

    let data:
      | IndicatorSMA[]
      | IndicatorRSI[]
      | IndicatorADX[]
      | IndicatorATR[]
      | IndicatorBB[]
      | IndicatorSMACross[] = []

    switch (indicator) {
      case IndicatorName.SMA:
        data = await indicatorService.getGraphSMA(symbol, interval)
        break
      case IndicatorName.RSI:
        data = await indicatorService.getGraphRSI(symbol, interval)
        break
      case IndicatorName.ADX:
        data = await indicatorService.getGraphADX(symbol, interval)
        break
      case IndicatorName.ATR:
        data = await indicatorService.getGraphATR(symbol, interval)
        break
      case IndicatorName.BB:
        data = await indicatorService.getGraphBB(symbol, interval)
        break
      case IndicatorName.SMACROSS:
        data = await indicatorService.getGraphSMACross(symbol, interval)
        break
    }

    response.json({ data: data })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
