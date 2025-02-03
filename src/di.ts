import { PrismaClient } from '@prisma/client'
import { Launcher } from './application/launcher'
import { BitmartApi } from './application/api/bitmart-api'
import { BitmartClientApi } from './infrastructure/api/bitmart-client-api'
import { BinanceApi } from './application/api/binance-api'
import { BinanceClientApi } from './infrastructure/api/binance-client-api'
import { BitmartApiService } from './domain/services/bitmart-api-service'
import { BinanceApiService } from './domain/services/binance-api-service'
import { EquityService } from './domain/services/equity-service'
import { EquityRepository } from './domain/repositories/equity-repository'
import { PrismaEquityFuturesRepository } from './infrastructure/repositories/prisma-equity-futures-repository'
import { PrismaEquitySpotRepository } from './infrastructure/repositories/prisma-equity-spot-repository'
import { AccountManager } from './domain/managers/account-manager'
import { ApiService } from './domain/services/api-service'
import { CommissionEquityService } from './domain/services/commission-equity-service'
import { CommissionEquityRepository } from './domain/repositories/commission-equity-repository'
import { PrismaCommissionEquitySpotRepository } from './infrastructure/repositories/prisma-commission-equity-spot-repository'
import { CommissionSpotManager } from './domain/managers/commission-spot-manager'

class Container {
  private static launcherSpot: Launcher
  private static launcherFutures: Launcher
  private static bitmartApiService: BitmartApiService
  private static binanceApiService: BinanceApiService
  private static apiSpotService: ApiService
  private static apiFuturesService: ApiService
  private static equitySpotService: EquityService
  private static commissionEquitySpotService: CommissionEquityService
  private static equityFuturesService: EquityService

  static initialize(): void {
    const bitmartApi: BitmartApi = new BitmartClientApi()
    const binanceApi: BinanceApi = new BinanceClientApi()
    const prisma: PrismaClient = new PrismaClient()

    const equitySpotRepository: EquityRepository =
      new PrismaEquitySpotRepository(prisma)
    const commissionEquitySpotRepository: CommissionEquityRepository =
      new PrismaCommissionEquitySpotRepository(prisma)
    const equityFuturesRepository: EquityRepository =
      new PrismaEquityFuturesRepository(prisma)

    this.bitmartApiService = new BitmartApiService(bitmartApi)
    this.binanceApiService = new BinanceApiService(binanceApi)
    this.apiSpotService = new ApiService(binanceApi)
    this.apiFuturesService = new ApiService(bitmartApi)
    this.equitySpotService = new EquityService(equitySpotRepository)
    this.commissionEquitySpotService = new CommissionEquityService(
      commissionEquitySpotRepository,
    )
    this.equityFuturesService = new EquityService(equityFuturesRepository)

    const accountSpotManager: AccountManager = new AccountManager(
      this.apiSpotService,
      this.equitySpotService,
    )

    const commissionSpotManager: CommissionSpotManager =
      new CommissionSpotManager(
        this.binanceApiService,
        this.commissionEquitySpotService,
      )

    const accountFuturesManager: AccountManager = new AccountManager(
      this.apiFuturesService,
      this.equityFuturesService,
    )

    this.launcherSpot = new Launcher(
      [],
      [accountSpotManager, commissionSpotManager],
    )
    this.launcherFutures = new Launcher([], [accountFuturesManager])
  }

  static getLauncherSpot(): Launcher {
    return this.launcherSpot
  }

  static getLauncherFutures(): Launcher {
    return this.launcherFutures
  }

  static getBitmartApiService(): BitmartApiService {
    return this.bitmartApiService
  }

  static getBinanceApiService(): BinanceApiService {
    return this.binanceApiService
  }

  static getApiSpotService(): ApiService {
    return this.apiSpotService
  }

  static getApiFuturesService(): ApiService {
    return this.apiFuturesService
  }

  static getEquitySpotService(): EquityService {
    return this.equitySpotService
  }

  static getCommissionEquitySpotService(): CommissionEquityService {
    return this.commissionEquitySpotService
  }

  static getEquityFuturesService(): EquityService {
    return this.equityFuturesService
  }
}

Container.initialize()
export { Container }
