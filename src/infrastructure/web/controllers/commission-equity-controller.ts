import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { CommissionEquityService } from '../../../domain/services/commission-equity-service'
import { CommissionEquity } from '../../../domain/models/commission-equity'

const commissionEquitySpotService: CommissionEquityService =
  Container.getCommissionEquitySpotService()

export async function getCommissionEquitySpot(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const commissionEquity: CommissionEquity =
      await commissionEquitySpotService.get()

    response.json({
      data: commissionEquity,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
