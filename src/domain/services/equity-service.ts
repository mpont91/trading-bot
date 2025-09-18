import { TimeInterval } from '../types/time-interval'
import { EquityRepository } from '../repositories/equity-repository'
import { Equity, EquityCreate } from '../models/equity'
import { reduceRecordsData } from '../helpers/graph-helper'

export class EquityService {
  constructor(private readonly equityRepository: EquityRepository) {}

  async store(equity: EquityCreate): Promise<void> {
    await this.equityRepository.create(equity)
  }

  async graph(interval: TimeInterval): Promise<Equity[]> {
    const equities: Equity[] = await this.equityRepository.get(interval)

    return reduceRecordsData(equities)
  }
}
