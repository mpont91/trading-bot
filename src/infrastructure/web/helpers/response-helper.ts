import { Response } from 'express'

export function createErrorResponse(response: Response, error: unknown): void {
  let errorMessage: string = 'Unknown error on the server'

  if (error instanceof Error) {
    errorMessage = error.message
  }
  response.status(500).json({
    error: errorMessage,
  })
}
