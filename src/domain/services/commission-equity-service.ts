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

  async store(): Promise<CommissionEquity> {
    const commissionEquity: CommissionEquityCreate =
      await this.apiService.getCommissionEquity()
    return this.commissionEquityRepository.create(commissionEquity)
  }

  async get(): Promise<CommissionEquity | null> {
    return this.commissionEquityRepository.get()
  }
}
