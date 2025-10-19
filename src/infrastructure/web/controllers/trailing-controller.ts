import { Request, Response } from 'express'
import { Container } from '../../../di'
import { createErrorResponse } from '../helpers/response-helper'
import { TrailingService } from '../../../domain/services/trailing-service'
import { Trailing } from '../../../domain/models/trailing'

const trailingService: TrailingService = Container.getTrailingService()

export async function getTrailing(
  _: Request,
  response: Response,
): Promise<void> {
  try {
    const trailing: Trailing[] = await trailingService.list()

    response.json({ data: trailing })
  } catch (error: unknown) {
    createErrorResponse(response, error)
  }
}
