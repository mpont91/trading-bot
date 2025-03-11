import { TimeInterval } from '../types/time-interval'
import { EquityRepository } from '../repositories/equity-repository'
import { Equity, EquityCreate } from '../models/equity'
import { EquityServiceInterface } from './equity-service-interface'
import { reduceRecordsData } from '../helpers/graph-helper'

export class EquityService implements EquityServiceInterface {
  constructor(private readonly equityRepository: EquityRepository) {}

  async store(amount: number): Promise<void> {
    const equity: EquityCreate = { amount: amount }
    await this.equityRepository.create(equity)
  }

  async graph(interval: TimeInterval): Promise<Equity[]> {
    const equities: Equity[] = await this.equityRepository.get(interval)

    return reduceRecordsData(equities)
  }
}
