import { Request, Response } from 'express'
import { Container } from '../../../di'
import { createErrorResponse } from '../helpers/response-helper'
import { PositionService } from '../../../domain/services/position-service'
import { Position } from '../../../domain/models/position'

const positionService: PositionService = Container.getPositionService()

export async function getPositions(
  _: Request,
  response: Response,
): Promise<void> {
  try {
    const positions: Position[] = await positionService.list()

    response.json({ data: positions })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
