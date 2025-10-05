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
import { StrategyService } from './domain/services/strategy-service'
import { StrategyRepository } from './domain/repositories/strategy-repository'
import { PrismaStrategyRepository } from './infrastructure/repositories/prisma-strategy-repository'
import { TrailingService } from './domain/services/trailing-service'
import { TrailingRepository } from './domain/repositories/trailing-repository'
import { PrismaTrailingRepository } from './infrastructure/repositories/prisma-trailing-repository'
import { AdxIndicatorCalculator } from './domain/indicators/adx-indicator-calculator'
import { AtrIndicatorCalculator } from './domain/indicators/atr-indicator-calculator'
import { RsiIndicatorCalculator } from './domain/indicators/rsi-indicator-calculator'
import { SmaIndicatorCalculator } from './domain/indicators/sma-indicator-calculator'
import { BbIndicatorCalculator } from './domain/indicators/bb-indicator-calculator'
import { IndicatorService } from './domain/services/indicator-service'
import { IndicatorRepository } from './domain/repositories/indicator-repository'
import { PrismaIndicatorRepository } from './infrastructure/repositories/prisma-indicator-repository'
import { TradingManager } from './domain/managers/trading-manager'
import { SmaCrossIndicatorCalculator } from './domain/indicators/sma-cross-indicator-calculator'
import { BinanceSpotApi } from './infrastructure/api/binance-spot-api'
import { PositionRepository } from './domain/repositories/position-repository'
import { PrismaPositionRepository } from './infrastructure/repositories/prisma-position-repository'
import { DecisionService } from './domain/services/decision-service'
import { ExecutionService } from './domain/services/execution-service'
import { RiskService } from './domain/services/risk-service'
import { RiskRepository } from './domain/repositories/risk-repository'
import { PrismaRiskRepository } from './infrastructure/repositories/prisma-risk-repository'

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
  private static strategyService: StrategyService
  private static trailingService: TrailingService
  private static decisionService: DecisionService
  private static executionService: ExecutionService
  private static riskService: RiskService

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
    const indicatorRepository: IndicatorRepository =
      new PrismaIndicatorRepository(prisma)
    const strategyRepository: StrategyRepository = new PrismaStrategyRepository(
      prisma,
    )
    const positionRepository: PositionRepository = new PrismaPositionRepository(
      prisma,
    )
    const trailingRepository: TrailingRepository = new PrismaTrailingRepository(
      prisma,
    )
    const riskRepository: RiskRepository = new PrismaRiskRepository(prisma)

    const adxIndicatorCalculator: AdxIndicatorCalculator =
      new AdxIndicatorCalculator(settings.indicators.adx)
    const atrIndicatorCalculator: AtrIndicatorCalculator =
      new AtrIndicatorCalculator(settings.indicators.atr)
    const rsiIndicatorCalculator: RsiIndicatorCalculator =
      new RsiIndicatorCalculator(settings.indicators.rsi)
    const smaIndicatorCalculator: SmaIndicatorCalculator =
      new SmaIndicatorCalculator(settings.indicators.sma)
    const bbIndicatorCalculator: BbIndicatorCalculator =
      new BbIndicatorCalculator(
        settings.indicators.bb.period,
        settings.indicators.bb.multiplier,
      )
    const smaCrossIndicatorCalculator: SmaCrossIndicatorCalculator =
      new SmaCrossIndicatorCalculator(
        settings.indicators.smaCross.periodLong,
        settings.indicators.smaCross.periodShort,
      )

    this.apiService = new ApiService(settings.history, api)
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
    this.indicatorService = new IndicatorService(
      this.apiService,
      indicatorRepository,
      smaIndicatorCalculator,
      rsiIndicatorCalculator,
      adxIndicatorCalculator,
      atrIndicatorCalculator,
      bbIndicatorCalculator,
      smaCrossIndicatorCalculator,
    )
    this.riskService = new RiskService(settings.risk, riskRepository)
    this.decisionService = new DecisionService(
      this.indicatorService,
      this.riskService,
    )
    this.strategyService = new StrategyService(
      strategyRepository,
      this.decisionService,
    )
    this.executionService = new ExecutionService(
      this.positionService,
      this.strategyService,
      this.tradeService,
    )

    const accountManager: ManagerInterface = new AccountManager(
      this.equityService,
      this.commissionEquityService,
    )
    const marketManager: ManagerInterface = new MarketManager(
      settings.symbols,
      this.indicatorService,
      this.strategyService,
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
  static getRiskService(): RiskService {
    return this.riskService
  }
  static getIndicatorService(): IndicatorService {
    return this.indicatorService
  }
  static getStrategyService(): StrategyService {
    return this.strategyService
  }
  static getTrailingService(): TrailingService {
    return this.trailingService
  }
  static getDecisionService(): DecisionService {
    return this.decisionService
  }
}

Container.initialize()
export { Container }
