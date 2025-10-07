import { Container } from '../../di'
import { EquityService } from '../../domain/services/equity-service'
import {
  TimeInterval,
  timeIntervalSchema,
} from '../../domain/types/time-interval'
import { Equity } from '../../domain/models/equity'
import { z } from 'zod/index'

const requestSchema = z.tuple([timeIntervalSchema])

export default async function (args: string[]): Promise<void> {
  const [timeInterval]: [TimeInterval] = requestSchema.parse(args)

  const equityService: EquityService = Container.getEquityService()
  const response: Equity[] = await equityService.graph(timeInterval)

  console.dir(response, { depth: null })
}
