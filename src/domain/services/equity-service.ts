import { TimeInterval } from '../types/time-interval'
import { EquityRepository } from '../repositories/equity-repository'
import { Equity } from '../models/equity'
import { reduceRecordsData } from '../helpers/graph-helper'
import { ApiService } from './api-service'

export class EquityService {
  constructor(
    private readonly equityRepository: EquityRepository,
    private readonly apiService: ApiService,
  ) {}

  async store(): Promise<Equity> {
    return this.equityRepository.create(await this.apiService.getEquity())
  }

  async graph(interval: TimeInterval): Promise<Equity[]> {
    const equities: Equity[] = await this.equityRepository.get(interval)

    return reduceRecordsData(equities)
  }
}
