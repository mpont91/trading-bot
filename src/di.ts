import { PrismaClient } from '@prisma/client'
import { Launcher } from './application/launcher'
import { BitmartApi } from './application/api/bitmart-api'
import { BitmartClientApi } from './infrastructure/api/bitmart-client-api'
import { BinanceApi } from './application/api/binance-api'
import { BinanceClientApi } from './infrastructure/api/binance-client-api'
import { ApiFuturesService } from './domain/services/api-futures-service'
import { ApiSpotService } from './domain/services/api-spot-service'
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
import { PerformanceService } from './domain/services/performance-service'
import { OrderService } from './domain/services/order-service'
import { TradeService } from './domain/services/trade-service'
import { OrderRepository } from './domain/repositories/order-repository'
import { PrismaOrderSpotRepository } from './infrastructure/repositories/prisma-order-spot-repository'
import { TradeRepository } from './domain/repositories/trade-repository'
import { PrismaTradeSpotRepository } from './infrastructure/repositories/prisma-trade-spot-repository'
import { PrismaTradeFuturesRepository } from './infrastructure/repositories/prisma-trade-futures-repository'
import { PrismaOrderFuturesRepository } from './infrastructure/repositories/prisma-order-futures-repository'
import { PositionService } from './domain/services/position-service'
import { InvestmentService } from './domain/services/investment-service'
import {
  ApiSettings,
  BinanceSettings,
  BitmartSettings,
  settings,
  TradingSettings,
} from './application/settings'
import { PositionFuturesService } from './domain/services/position-futures-service'
import { PositionSpotService } from './domain/services/position-spot-service'
import { LeverageService } from './domain/services/leverage-service'
import { InvestmentFuturesService } from './domain/services/investment-futures-service'
import { TradeSpotService } from './domain/services/trade-spot-service'
import { TradeFuturesService } from './domain/services/trade-futures-service'
import { InvestmentSpotService } from './domain/services/investment-spot-service'

class Container {
  private static launcherSpot: Launcher
  private static launcherFutures: Launcher
  private static bitmartApiService: ApiFuturesService
  private static binanceApiService: ApiSpotService
  private static apiSpotService: ApiService
  private static apiFuturesService: ApiService
  private static equitySpotService: EquityService
  private static equityFuturesService: EquityService
  private static commissionEquitySpotService: CommissionEquityService
  private static investmentSpotService: InvestmentService
  private static investmentFuturesService: InvestmentService
  private static orderSpotService: OrderService
  private static orderFuturesService: OrderService
  private static tradeSpotService: TradeService
  private static tradeFuturesService: TradeService
  private static positionSpotService: PositionService
  private static positionFuturesService: PositionService
  private static performanceService: PerformanceService
  private static leverageService: LeverageService

  static initialize(): void {
    const bitmartSettings: BitmartSettings = settings.bitmart
    const binanceSettings: BinanceSettings = settings.binance
    const apiSettings: ApiSettings = settings.api
    const tradingSpotSettings: TradingSettings = settings.spotTrading
    const tradingFuturesSettings: TradingSettings = settings.futuresTrading
    const bitmartApi: BitmartApi = new BitmartClientApi(bitmartSettings)
    const binanceApi: BinanceApi = new BinanceClientApi(binanceSettings)
    const prisma: PrismaClient = new PrismaClient()

    const equitySpotRepository: EquityRepository =
      new PrismaEquitySpotRepository(prisma)
    const equityFuturesRepository: EquityRepository =
      new PrismaEquityFuturesRepository(prisma)
    const commissionEquitySpotRepository: CommissionEquityRepository =
      new PrismaCommissionEquitySpotRepository(prisma)
    const orderSpotRepository: OrderRepository = new PrismaOrderSpotRepository(
      prisma,
    )
    const orderFuturesRepository: OrderRepository =
      new PrismaOrderFuturesRepository(prisma)
    const tradeSpotRepository: TradeRepository = new PrismaTradeSpotRepository(
      prisma,
    )
    const tradeFuturesRepository: TradeRepository =
      new PrismaTradeFuturesRepository(prisma)

    this.bitmartApiService = new ApiFuturesService(bitmartApi)
    this.binanceApiService = new ApiSpotService(apiSettings, binanceApi)
    this.apiSpotService = new ApiSpotService(apiSettings, binanceApi)
    this.apiFuturesService = new ApiFuturesService(bitmartApi)
    this.equitySpotService = new EquityService(equitySpotRepository)
    this.equityFuturesService = new EquityService(equityFuturesRepository)
    this.commissionEquitySpotService = new CommissionEquityService(
      commissionEquitySpotRepository,
    )
    this.leverageService = new LeverageService()
    this.investmentSpotService = new InvestmentSpotService(
      tradingSpotSettings,
      this.apiSpotService,
    )
    this.investmentFuturesService = new InvestmentFuturesService(
      tradingFuturesSettings,
      this.apiFuturesService,
      this.leverageService,
    )
    this.orderSpotService = new OrderService(orderSpotRepository)
    this.orderFuturesService = new OrderService(orderFuturesRepository)
    this.tradeSpotService = new TradeSpotService(tradeSpotRepository)
    this.tradeFuturesService = new TradeFuturesService(tradeFuturesRepository)
    this.positionSpotService = new PositionSpotService(
      this.apiSpotService,
      this.investmentSpotService,
      this.orderSpotService,
      this.tradeSpotService,
    )
    this.positionFuturesService = new PositionFuturesService(
      this.apiFuturesService,
      this.investmentFuturesService,
      this.orderFuturesService,
      this.tradeFuturesService,
      this.leverageService,
    )
    this.performanceService = new PerformanceService()
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
      settings.intervalReportTime,
      settings.intervalExecutionTime,
      [],
      [accountSpotManager, commissionSpotManager],
    )
    this.launcherFutures = new Launcher(
      settings.intervalReportTime,
      settings.intervalExecutionTime,
      [],
      [accountFuturesManager],
    )
  }

  static getLauncherSpot(): Launcher {
    return this.launcherSpot
  }
  static getLauncherFutures(): Launcher {
    return this.launcherFutures
  }
  static getBitmartApiService(): ApiFuturesService {
    return this.bitmartApiService
  }
  static getBinanceApiService(): ApiSpotService {
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
  static getCommissionEquitySpotService(): CommissionEquityService {
    return this.commissionEquitySpotService
  }
  static getInvestmentSpotService(): InvestmentService {
    return this.investmentSpotService
  }
  static getInvestmentFuturesService(): InvestmentService {
    return this.investmentFuturesService
  }
  static getOrderSpotService(): OrderService {
    return this.orderSpotService
  }
  static getOrderFuturesService(): OrderService {
    return this.orderFuturesService
  }
  static getTradeSpotService(): TradeService {
    return this.tradeSpotService
  }
  static getTradeFuturesService(): TradeService {
    return this.tradeFuturesService
  }
  static getPositionSpotService(): PositionService {
    return this.positionSpotService
  }
  static getPositionFuturesService(): PositionService {
    return this.positionFuturesService
  }
  static getPerformanceService(): PerformanceService {
    return this.performanceService
  }
  static getLeverageService(): LeverageService {
    return this.leverageService
  }
}

Container.initialize()
export { Container }
