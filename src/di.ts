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
import { PrismaFuturesEquityRepository } from './infrastructure/repositories/prisma-futures-equity-repository'
import { PrismaSpotEquityRepository } from './infrastructure/repositories/prisma-spot-equity-repository'
import { AccountManager } from './domain/managers/account-manager'
import { ApiService } from './domain/services/api-service'

class Container {
  private static launcherSpot: Launcher
  private static launcherFutures: Launcher
  private static bitmartApiService: BitmartApiService
  private static binanceApiService: BinanceApiService
  private static apiSpotService: ApiService
  private static apiFuturesService: ApiService
  private static equitySpotService: EquityService
  private static equityFuturesService: EquityService

  static initialize(): void {
    const bitmartApi: BitmartApi = new BitmartClientApi()
    const binanceApi: BinanceApi = new BinanceClientApi()
    const prisma: PrismaClient = new PrismaClient()

    const equitySpotRepository: EquityRepository =
      new PrismaSpotEquityRepository(prisma)
    const equityFuturesRepository: EquityRepository =
      new PrismaFuturesEquityRepository(prisma)

    this.bitmartApiService = new BitmartApiService(bitmartApi)
    this.binanceApiService = new BinanceApiService(binanceApi)
    this.apiSpotService = new ApiService(binanceApi)
    this.apiFuturesService = new ApiService(bitmartApi)
    this.equitySpotService = new EquityService(equitySpotRepository)
    this.equityFuturesService = new EquityService(equityFuturesRepository)

    const accountSpotManager: AccountManager = new AccountManager(
      this.apiSpotService,
      this.equitySpotService,
    )

    const accountFuturesManager: AccountManager = new AccountManager(
      this.apiFuturesService,
      this.equityFuturesService,
    )

    this.launcherSpot = new Launcher(accountSpotManager)
    this.launcherFutures = new Launcher(accountFuturesManager)
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

  static getEquityFuturesService(): EquityService {
    return this.equityFuturesService
  }
}

Container.initialize()
export { Container }
