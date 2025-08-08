import { PrismaClient } from '@prisma/client'
import { Launcher } from './application/launcher'
import { BinanceApi } from './application/api/binance-api'
import { BinanceClientApi } from './infrastructure/api/binance-client-api'
import { ApiSpotService } from './domain/services/api-spot-service'
import { EquityService } from './domain/services/equity-service'
import { EquityRepository } from './domain/repositories/equity-repository'
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
import { PositionService } from './domain/services/position-service'
import { InvestmentService } from './domain/services/investment-service'
import { settings } from './application/settings'
import { PositionSpotService } from './domain/services/position-spot-service'
import { LeverageService } from './domain/services/leverage-service'
import { TradeSpotService } from './domain/services/trade-spot-service'
import { InvestmentSpotService } from './domain/services/investment-spot-service'
import { MarketManager } from './domain/managers/market-manager'
import { ManagerInterface } from './domain/managers/manager-interface'
import { StrategyService } from './domain/services/strategy-service'
import { StrategyRepository } from './domain/repositories/strategy-repository'
import { PrismaStrategySpotRepository } from './infrastructure/repositories/prisma-strategy-spot-repository'
import {
  ApiSettings,
  BinanceSettings,
  IndicatorsSettings,
  StopsSettings,
  TradingSettings,
} from './domain/types/settings'
import { TrailingService } from './domain/services/trailing-service'
import { TrailingRepository } from './domain/repositories/trailing-repository'
import { PrismaTrailingSpotRepository } from './infrastructure/repositories/prisma-trailing-spot-repository'
import { AdxIndicator } from './domain/indicators/adx-indicator'
import { AtrIndicator } from './domain/indicators/atr-indicator'
import { RsiIndicator } from './domain/indicators/rsi-indicator'
import { SmaIndicator } from './domain/indicators/sma-indicator'
import { BbIndicator } from './domain/indicators/bb-indicator'
import { IndicatorService } from './domain/services/indicator-service'
import { IndicatorRepository } from './domain/repositories/indicator-repository'
import { PrismaIndicatorRepository } from './infrastructure/repositories/prisma-indicator-repository'
import { StopsService } from './domain/services/stops-service'
import { TradingManager } from './domain/managers/trading-manager'
import { SpotStrategy } from './domain/strategies/spot-strategy'
import { SmaCrossIndicator } from './domain/indicators/sma-cross-indicator'

class Container {
  private static launcherSpotMarket: Launcher
  private static launcherSpotTrading: Launcher
  private static launcherSpotAccount: Launcher
  private static apiSpotService: ApiService
  private static apiSpotConcreteService: ApiSpotService
  private static equitySpotService: EquityService
  private static commissionEquitySpotService: CommissionEquityService
  private static investmentSpotService: InvestmentService
  private static orderSpotService: OrderService
  private static tradeSpotService: TradeService
  private static positionSpotService: PositionService
  private static performanceSpotService: PerformanceService
  private static leverageService: LeverageService
  private static stopsService: StopsService
  private static indicatorService: IndicatorService
  private static strategySpotService: StrategyService
  private static trailingSpotService: TrailingService

  static initialize(): void {
    const binanceSettings: BinanceSettings = settings.binance
    const apiSettings: ApiSettings = settings.api
    const tradingSpotSettings: TradingSettings = settings.spotTrading
    const indicatorsSettings: IndicatorsSettings = settings.indicators
    const stopsSettings: StopsSettings = settings.stops
    const leverageSettings: number = settings.leverage

    const binanceApi: BinanceApi = new BinanceClientApi(binanceSettings)
    const prisma: PrismaClient = new PrismaClient()

    const equitySpotRepository: EquityRepository =
      new PrismaEquitySpotRepository(prisma)
    const commissionEquitySpotRepository: CommissionEquityRepository =
      new PrismaCommissionEquitySpotRepository(prisma)
    const orderSpotRepository: OrderRepository = new PrismaOrderSpotRepository(
      prisma,
    )
    const tradeSpotRepository: TradeRepository = new PrismaTradeSpotRepository(
      prisma,
    )
    const indicatorRepository: IndicatorRepository =
      new PrismaIndicatorRepository(prisma)
    const strategySpotRepository: StrategyRepository =
      new PrismaStrategySpotRepository(prisma)
    const trailingSpotRepository: TrailingRepository =
      new PrismaTrailingSpotRepository(prisma)

    const adxIndicator: AdxIndicator = new AdxIndicator(indicatorsSettings.adx)
    const atrIndicator: AtrIndicator = new AtrIndicator(indicatorsSettings.atr)
    const rsiIndicator: RsiIndicator = new RsiIndicator(indicatorsSettings.rsi)
    const smaIndicator: SmaIndicator = new SmaIndicator(indicatorsSettings.sma)
    const bbIndicator: BbIndicator = new BbIndicator(
      indicatorsSettings.bb.period,
      indicatorsSettings.bb.multiplier,
    )
    const smaCrossIndicator: SmaCrossIndicator = new SmaCrossIndicator(
      indicatorsSettings.smaCross.periodLong,
      indicatorsSettings.smaCross.periodShort,
    )

    this.apiSpotService = new ApiSpotService(apiSettings, binanceApi)
    this.apiSpotConcreteService = new ApiSpotService(apiSettings, binanceApi)

    this.equitySpotService = new EquityService(equitySpotRepository)
    this.strategySpotService = new StrategyService(strategySpotRepository)
    this.commissionEquitySpotService = new CommissionEquityService(
      commissionEquitySpotRepository,
    )
    this.leverageService = new LeverageService(leverageSettings)
    this.stopsService = new StopsService(stopsSettings)
    this.trailingSpotService = new TrailingService(trailingSpotRepository)
    this.orderSpotService = new OrderService(orderSpotRepository)
    this.tradeSpotService = new TradeSpotService(tradeSpotRepository)
    this.performanceSpotService = new PerformanceService(this.tradeSpotService)
    this.investmentSpotService = new InvestmentSpotService(
      tradingSpotSettings,
      this.apiSpotService,
    )
    this.positionSpotService = new PositionSpotService(
      this.apiSpotService,
      this.investmentSpotService,
      this.orderSpotService,
      this.tradeSpotService,
      this.trailingSpotService,
    )
    this.indicatorService = new IndicatorService(
      indicatorRepository,
      smaIndicator,
      rsiIndicator,
      adxIndicator,
      atrIndicator,
      bbIndicator,
      smaCrossIndicator,
    )

    const spotStrategy: SpotStrategy = new SpotStrategy(
      this.indicatorService,
      this.stopsService,
    )

    const accountSpotManager: ManagerInterface = new AccountManager(
      this.apiSpotService,
      this.equitySpotService,
    )
    const commissionSpotManager: ManagerInterface = new CommissionSpotManager(
      this.apiSpotConcreteService,
      this.commissionEquitySpotService,
    )
    const marketSpotManager: ManagerInterface = new MarketManager(
      tradingSpotSettings.symbols,
      this.apiSpotService,
      this.indicatorService,
      spotStrategy,
      this.strategySpotService,
    )
    const tradingSpotManager: TradingManager = new TradingManager(
      tradingSpotSettings.symbols,
      this.positionSpotService,
      this.strategySpotService,
      this.trailingSpotService,
    )
    this.launcherSpotMarket = new Launcher(settings.intervalMarketTime, [
      marketSpotManager,
    ])
    this.launcherSpotTrading = new Launcher(settings.intervalTradingTime, [
      tradingSpotManager,
    ])
    this.launcherSpotAccount = new Launcher(settings.intervalAccountTime, [
      accountSpotManager,
      commissionSpotManager,
    ])
  }

  static getLauncherSpotMarket(): Launcher {
    return this.launcherSpotMarket
  }
  static getLauncherSpotTrading(): Launcher {
    return this.launcherSpotTrading
  }
  static getLauncherSpotAccount(): Launcher {
    return this.launcherSpotAccount
  }
  static getApiSpotService(): ApiService {
    return this.apiSpotService
  }
  static getApiSpotConcreteService(): ApiSpotService {
    return this.apiSpotConcreteService
  }
  static getEquitySpotService(): EquityService {
    return this.equitySpotService
  }
  static getCommissionEquitySpotService(): CommissionEquityService {
    return this.commissionEquitySpotService
  }
  static getInvestmentSpotService(): InvestmentService {
    return this.investmentSpotService
  }
  static getOrderSpotService(): OrderService {
    return this.orderSpotService
  }
  static getTradeSpotService(): TradeService {
    return this.tradeSpotService
  }
  static getPositionSpotService(): PositionService {
    return this.positionSpotService
  }
  static getPerformanceSpotService(): PerformanceService {
    return this.performanceSpotService
  }
  static getLeverageService(): LeverageService {
    return this.leverageService
  }
  static getStopsService(): StopsService {
    return this.stopsService
  }
  static getIndicatorService(): IndicatorService {
    return this.indicatorService
  }
  static getStrategySpotService(): StrategyService {
    return this.strategySpotService
  }
  static getTrailingSpotService(): TrailingService {
    return this.trailingSpotService
  }
}

Container.initialize()
export { Container }
