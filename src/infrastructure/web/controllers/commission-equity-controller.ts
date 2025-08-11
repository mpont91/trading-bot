import { Request, Response } from 'express'
import { createErrorResponse } from '../helpers/response-helper'
import { Container } from '../../../di'
import { CommissionEquityService } from '../../../domain/services/commission-equity-service'
import { CommissionEquity } from '../../../domain/models/commission-equity'

const commissionEquityService: CommissionEquityService =
  Container.getCommissionEquityService()

export async function getCommissionEquity(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const commissionEquity: CommissionEquity =
      await commissionEquityService.get()

    response.json({
      data: commissionEquity,
    })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
