import { TimeInterval } from '../types/time-interval'
import { Equity } from '../models/equity'
import { EquityService } from './equity-service'
import { EquityServiceInterface } from './equity-service-interface'

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

    return this.reduceToDesiredRecords(mergedEquities, 100)
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

  private reduceToDesiredRecords(
    equities: Equity[],
    desiredRecords: number,
  ): Equity[] {
    if (equities.length <= desiredRecords) {
      return equities
    }

    const step = (equities.length - 1) / (desiredRecords - 1)
    const reducedData: Equity[] = []

    for (let i = 0; i < desiredRecords - 1; i++) {
      const index = Math.floor(i * step)
      reducedData.push(equities[index])
    }

    // Asegurar el último punto
    reducedData.push(equities[equities.length - 1])

    return reducedData
  }
}
