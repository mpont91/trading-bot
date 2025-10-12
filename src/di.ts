import { PrismaClient } from '@prisma/client'
import { Launcher } from './application/launcher'
import { Api } from './application/api'
import { BinanceClientApi } from './infrastructure/api/binance-client-api'
import { ApiService } from './domain/services/api-service'
import { EquityService } from './domain/services/equity-service'
import { EquityRepository } from './domain/repositories/equity-repository'
import { PrismaEquityRepository } from './infrastructure/repositories/prisma-equity-repository'
import { AccountManager } from './domain/managers/account-manager'
import { CommissionEquityService } from './domain/services/commission-equity-service'
import { CommissionEquityRepository } from './domain/repositories/commission-equity-repository'
import { PrismaCommissionEquityRepository } from './infrastructure/repositories/prisma-commission-equity-repository'
import { PerformanceService } from './domain/services/performance-service'
import { OrderService } from './domain/services/order-service'
import { TradeService } from './domain/services/trade-service'
import { OrderRepository } from './domain/repositories/order-repository'
import { PrismaOrderRepository } from './infrastructure/repositories/prisma-order-repository'
import { TradeRepository } from './domain/repositories/trade-repository'
import { PrismaTradeRepository } from './infrastructure/repositories/prisma-trade-repository'
import { PositionService } from './domain/services/position-service'
import { InvestmentService } from './domain/services/investment-service'
import { settings } from './application/settings'
import { MarketManager } from './domain/managers/market-manager'
import { ManagerInterface } from './domain/managers/manager-interface'
import { StrategyActionService } from './domain/services/strategy-action-service'
import { StrategyActionRepository } from './domain/repositories/strategy-action-repository'
import { PrismaStrategyActionRepository } from './infrastructure/repositories/prisma-strategy-action-repository'
import { TrailingService } from './domain/services/trailing-service'
import { TrailingRepository } from './domain/repositories/trailing-repository'
import { PrismaTrailingRepository } from './infrastructure/repositories/prisma-trailing-repository'
import { IndicatorService } from './domain/services/indicator-service'
import { TradingManager } from './domain/managers/trading-manager'
import { BinanceSpotApi } from './infrastructure/api/binance-spot-api'
import { PositionRepository } from './domain/repositories/position-repository'
import { PrismaPositionRepository } from './infrastructure/repositories/prisma-position-repository'
import { StrategyReportService } from './domain/services/strategy-report-service'
import { ExecutionService } from './domain/services/execution-service'
import { StrategyReportRepository } from './domain/repositories/strategy-report-repository'
import { PrismaStrategyReportRepository } from './infrastructure/repositories/prisma-strategy-report-repository'
import { Strategy } from './domain/strategies/strategy'
import { MarketService } from './domain/services/market-service'

class Container {
  private static launcherMarket: Launcher
  private static launcherTrading: Launcher
  private static launcherAccount: Launcher
  private static apiService: ApiService
  private static equityService: EquityService
  private static commissionEquityService: CommissionEquityService
  private static investmentService: InvestmentService
  private static orderService: OrderService
  private static tradeService: TradeService
  private static positionService: PositionService
  private static performanceService: PerformanceService
  private static indicatorService: IndicatorService
  private static strategyActionService: StrategyActionService
  private static trailingService: TrailingService
  private static strategyReportService: StrategyReportService
  private static executionService: ExecutionService
  private static marketService: MarketService
  private static strategy: Strategy

  static initialize(): void {
    const spot: BinanceSpotApi = new BinanceSpotApi(settings.binance)
    const api: Api = new BinanceClientApi(spot, settings.binance)
    const prisma: PrismaClient = new PrismaClient()

    const equityRepository: EquityRepository = new PrismaEquityRepository(
      prisma,
    )
    const commissionEquityRepository: CommissionEquityRepository =
      new PrismaCommissionEquityRepository(prisma)
    const orderRepository: OrderRepository = new PrismaOrderRepository(prisma)
    const tradeRepository: TradeRepository = new PrismaTradeRepository(prisma)
    const strategyActionRepository: StrategyActionRepository =
      new PrismaStrategyActionRepository(prisma)
    const positionRepository: PositionRepository = new PrismaPositionRepository(
      prisma,
    )
    const trailingRepository: TrailingRepository = new PrismaTrailingRepository(
      prisma,
    )
    const strategyReportRepository: StrategyReportRepository =
      new PrismaStrategyReportRepository(prisma)

    this.apiService = new ApiService(api)
    this.equityService = new EquityService(equityRepository, this.apiService)
    this.commissionEquityService = new CommissionEquityService(
      commissionEquityRepository,
      this.apiService,
    )
    this.trailingService = new TrailingService(
      trailingRepository,
      this.apiService,
    )
    this.orderService = new OrderService(this.apiService, orderRepository)
    this.tradeService = new TradeService(
      settings.maxPositionsOpened,
      tradeRepository,
      this.positionService,
      this.orderService,
      this.trailingService,
    )
    this.performanceService = new PerformanceService(tradeRepository)
    this.investmentService = new InvestmentService(
      settings.safetyCapitalMargin,
      settings.maxPositionsOpened,
      this.apiService,
    )
    this.positionService = new PositionService(
      positionRepository,
      this.investmentService,
      this.orderService,
    )
    this.indicatorService = new IndicatorService(this.apiService)
    this.strategyReportService = new StrategyReportService(
      strategyReportRepository,
    )
    this.strategyActionService = new StrategyActionService(
      strategyActionRepository,
    )
    this.executionService = new ExecutionService(
      this.positionService,
      this.strategyActionService,
      this.tradeService,
    )
    this.strategy = new Strategy(this.indicatorService)
    this.marketService = new MarketService(
      this.strategyActionService,
      this.strategyReportService,
      this.strategy,
      this.apiService,
    )

    const accountManager: ManagerInterface = new AccountManager(
      this.equityService,
      this.commissionEquityService,
    )
    const marketManager: ManagerInterface = new MarketManager(
      settings.symbols,
      this.marketService,
    )
    const tradingManager: TradingManager = new TradingManager(
      settings.symbols,
      this.executionService,
    )
    this.launcherMarket = new Launcher(settings.intervalMarketTime, [
      marketManager,
    ])
    this.launcherTrading = new Launcher(settings.intervalTradingTime, [
      tradingManager,
    ])
    this.launcherAccount = new Launcher(settings.intervalAccountTime, [
      accountManager,
    ])
  }

  static getLauncherMarket(): Launcher {
    return this.launcherMarket
  }
  static getLauncherTrading(): Launcher {
    return this.launcherTrading
  }
  static getLauncherAccount(): Launcher {
    return this.launcherAccount
  }
  static getApiService(): ApiService {
    return this.apiService
  }
  static getEquityService(): EquityService {
    return this.equityService
  }
  static getCommissionEquityService(): CommissionEquityService {
    return this.commissionEquityService
  }
  static getInvestmentService(): InvestmentService {
    return this.investmentService
  }
  static getOrderService(): OrderService {
    return this.orderService
  }
  static getTradeService(): TradeService {
    return this.tradeService
  }
  static getPositionService(): PositionService {
    return this.positionService
  }
  static getPerformanceService(): PerformanceService {
    return this.performanceService
  }
  static getIndicatorService(): IndicatorService {
    return this.indicatorService
  }
  static getStrategyActionService(): StrategyActionService {
    return this.strategyActionService
  }
  static getTrailingService(): TrailingService {
    return this.trailingService
  }
  static getStrategyReportService(): StrategyReportService {
    return this.strategyReportService
  }
  static getMarketService(): MarketService {
    return this.marketService
  }
  static getStrategy(): Strategy {
    return this.strategy
  }
}

Container.initialize()
export { Container }
