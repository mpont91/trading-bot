import { TimeInterval } from '../types/time-interval'
import { EquityRepository } from '../repositories/equity-repository'
import { Equity, EquityCreate } from '../models/equity'
import { EquityServiceInterface } from './equity-service-interface'

export class EquityService implements EquityServiceInterface {
  constructor(private readonly equityRepository: EquityRepository) {}

  async store(amount: number): Promise<void> {
    const equity: EquityCreate = { amount: amount }
    await this.equityRepository.create(equity)
  }

  async graph(interval: TimeInterval): Promise<Equity[]> {
    const equities: Equity[] = await this.equityRepository.get(interval)

    const desiredRecords: number = 100

    if (equities.length <= desiredRecords) {
      return equities
    }

    const step: number = (equities.length - 1) / (desiredRecords - 1)
    const reducedData: Equity[] = []

    for (let i: number = 0; i < desiredRecords - 1; i++) {
      const index: number = Math.floor(i * step)
      reducedData.push(equities[index])
    }

    reducedData[reducedData.length - 1] = equities[equities.length - 1]

    return reducedData
  }
}
