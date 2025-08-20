import { TimeInterval } from '../types/time-interval'
import { PnlRepository } from '../repositories/pnl-repository'
import { Pnl, PnlCreate } from '../models/pnl'
import { reduceRecordsData } from '../helpers/graph-helper'

export class PnlService {
  constructor(private readonly pnlRepository: PnlRepository) {}

  async store(amount: number): Promise<void> {
    const pnl: PnlCreate = { amount: amount }
    await this.pnlRepository.create(pnl)
  }

  async graph(interval: TimeInterval): Promise<Pnl[]> {
    const equities: Pnl[] = await this.pnlRepository.get(interval)

    return reduceRecordsData(equities)
  }
}
