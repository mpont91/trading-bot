import { TimeInterval } from '../types/time-interval'
import { Equity } from '../models/equity'
import { EquityService } from './equity-service'
import { EquityServiceInterface } from './equity-service-interface'
import { reduceRecordsData } from '../helpers/graph-helper'

export class EquityFullService implements EquityServiceInterface {
  constructor(
    private readonly spotService: EquityService,
    private readonly futuresService: EquityService,
  ) {}

  async graph(interval: TimeInterval): Promise<Equity[]> {
    const [spotEquities, futuresEquities] = await Promise.all([
      this.spotService.graph(interval),
      this.futuresService.graph(interval),
    ])

    const mergedEquities: Equity[] = this.mergeEquities(
      spotEquities,
      futuresEquities,
    )

    return reduceRecordsData(mergedEquities)
  }

  private mergeEquities(spot: Equity[], futures: Equity[]): Equity[] {
    if (spot.length !== futures.length) {
      throw new Error('Spot and Futures equities must have the same length')
    }

    return spot.map(
      (spotEquity: Equity, index: number): Equity => ({
        id: spotEquity.id,
        createdAt: spotEquity.createdAt,
        amount: spotEquity.amount + futures[index].amount,
      }),
    )
  }
}
