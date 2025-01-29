import { PrismaClient } from '@prisma/client'
import { LauncherSpot } from './application/launcher-spot'
import { LauncherFutures } from './application/launcher-futures'
import { BitmartApi } from './application/api/bitmart-api'
import { BitmartClientApi } from './infrastructure/api/bitmart-client-api'
import { BinanceApi } from './application/api/binance-api'
import { BinanceClientApi } from './infrastructure/api/binance-client-api'
import { BitmartApiService } from './domain/services/bitmart-api-service'
import { BinanceApiService } from './domain/services/binance-api-service'

class Container {
  private static launcherSpot: LauncherSpot
  private static launcherFutures: LauncherFutures
  private static bitmartApiService: BitmartApiService
  private static binanceApiService: BinanceApiService

  static initialize(): void {
    const bitmartApi: BitmartApi = new BitmartClientApi()
    const binanceApi: BinanceApi = new BinanceClientApi()
    const prisma: PrismaClient = new PrismaClient()

    this.bitmartApiService = new BitmartApiService(bitmartApi)
    this.binanceApiService = new BinanceApiService(binanceApi)
    this.launcherSpot = new LauncherSpot()
    this.launcherFutures = new LauncherFutures()
  }

  static getLauncherSpot(): LauncherSpot {
    return this.launcherSpot
  }

  static getLauncherFutures(): LauncherFutures {
    return this.launcherFutures
  }

  static getBitmartApiService(): BitmartApiService {
    return this.bitmartApiService
  }

  static getBinanceApiService(): BinanceApiService {
    return this.binanceApiService
  }
}

Container.initialize()
export { Container }
