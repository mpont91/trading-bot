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

  async create(
    commissionEquity: CommissionEquityCreate,
  ): Promise<CommissionEquity> {
    return this.commissionEquityRepository.create(commissionEquity)
  }

  async fetchAndCreate(): Promise<CommissionEquity> {
    return this.create(await this.apiService.getCommissionEquity())
  }

  async get(): Promise<CommissionEquity | null> {
    return this.commissionEquityRepository.get()
  }
}
