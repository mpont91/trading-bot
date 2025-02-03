import { CommissionEquityRepository } from '../repositories/commission-equity-repository'
import {
  CommissionEquity,
  CommissionEquityCreate,
} from '../models/commission-equity'

export class CommissionEquityService {
  constructor(
    private readonly commissionEquityRepository: CommissionEquityRepository,
  ) {}

  async store(commissionEquityCreate: CommissionEquityCreate): Promise<void> {
    await this.commissionEquityRepository.create(commissionEquityCreate)
  }

  async get(): Promise<CommissionEquity> {
    return await this.commissionEquityRepository.get()
  }
}
