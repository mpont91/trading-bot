import { CommissionEquityRepository } from '../repositories/commission-equity-repository'
import { CommissionEquity } from '../models/commission-equity'
import { ApiService } from './api-service'

export class CommissionEquityService {
  constructor(
    private readonly commissionEquityRepository: CommissionEquityRepository,
    private readonly apiService: ApiService,
  ) {}

  async store(): Promise<CommissionEquity> {
    return this.commissionEquityRepository.create(
      await this.apiService.getCommissionEquity(),
    )
  }

  async get(): Promise<CommissionEquity | null> {
    return this.commissionEquityRepository.get()
  }
}
