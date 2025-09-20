import { CommissionEquityRepository } from '../repositories/commission-equity-repository'
import {
  CommissionEquity,
  CommissionEquityCreate,
} from '../models/commission-equity'
import { ApiService } from './api-service'

export class CommissionEquityService {
  constructor(
    private readonly commissionEquityRepository: CommissionEquityRepository,
    private readonly apiService: ApiService,
  ) {}

  async store(): Promise<void> {
    const commissionEquity: CommissionEquityCreate =
      await this.apiService.getCommissionEquity()
    await this.commissionEquityRepository.create(commissionEquity)
  }

  async get(): Promise<CommissionEquity> {
    return this.commissionEquityRepository.get()
  }
}
