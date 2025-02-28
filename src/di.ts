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
import { settings } from './application/settings'
import { PositionFuturesService } from './domain/services/position-futures-service'
import { PositionSpotService } from './domain/services/position-spot-service'
import { LeverageService } from './domain/services/leverage-service'
import { InvestmentFuturesService } from './domain/services/investment-futures-service'
import { TradeSpotService } from './domain/services/trade-spot-service'
import { TradeFuturesService } from './domain/services/trade-futures-service'
import { InvestmentSpotService } from './domain/services/investment-spot-service'
import { MarketManager } from './domain/managers/market-manager'
import { ManagerInterface } from './domain/managers/manager-interface'
import { PredictionService } from './domain/services/prediction-service'
import { StrategyService } from './domain/services/strategy-service'
import { StrategyRepository } from './domain/repositories/strategy-repository'
import { PrismaStrategyRepository } from './infrastructure/repositories/prisma-strategy-repository'
import {
  ApiSettings,
  BinanceSettings,
  BitmartSettings,
  IndicatorsSettings,
  MarketSettings,
  StopsSettings,
  TradingSettings,
} from './domain/types/settings'
import { TrailingService } from './domain/services/trailing-service'
import { TrailingRepository } from './domain/repositories/trailing-repository'
import { PrismaTrailingSpotRepository } from './infrastructure/repositories/prisma-trailing-spot-repository'
import { PrismaTrailingFuturesRepository } from './infrastructure/repositories/prisma-trailing-futures-repository'
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
import { PerformanceFullService } from './domain/services/performance-full-service'
import { EquityFullService } from './domain/services/equity-full-service'

class Container {
  private static launcherMarket: Launcher
  private static launcherSpotTrading: Launcher
  private static launcherSpotAccount: Launcher
  private static launcherFuturesTrading: Launcher
  private static launcherFuturesAccount: Launcher
  private static apiSpotService: ApiService
  private static apiFuturesService: ApiService
  private static apiSpotConcreteService: ApiSpotService
  private static apiFuturesConcreteService: ApiFuturesService
  private static equitySpotService: EquityService
  private static equityFuturesService: EquityService
  private static equityFullService: EquityFullService
  private static commissionEquitySpotService: CommissionEquityService
  private static investmentSpotService: InvestmentService
  private static investmentFuturesService: InvestmentService
  private static orderSpotService: OrderService
  private static orderFuturesService: OrderService
  private static tradeSpotService: TradeService
  private static tradeFuturesService: TradeService
  private static positionSpotService: PositionService
  private static positionFuturesService: PositionService
  private static performanceSpotService: PerformanceService
  private static performanceFuturesService: PerformanceService
  private static performanceFullService: PerformanceFullService
  private static leverageService: LeverageService
  private static stopsService: StopsService
  private static predictionService: PredictionService
  private static indicatorService: IndicatorService
  private static strategyService: StrategyService
  private static trailingSpotService: TrailingService
  private static trailingFuturesService: TrailingService

  static initialize(): void {
    const bitmartSettings: BitmartSettings = settings.bitmart
    const binanceSettings: BinanceSettings = settings.binance
    const apiSettings: ApiSettings = settings.api
    const tradingSpotSettings: TradingSettings = settings.spotTrading
    const tradingFuturesSettings: TradingSettings = settings.futuresTrading
    const marketSettings: MarketSettings = settings.market
    const indicatorsSettings: IndicatorsSettings = settings.indicators
    const stopsSettings: StopsSettings = settings.stops
    const leverageSettings: number = settings.leverage

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
    const indicatorRepository: IndicatorRepository =
      new PrismaIndicatorRepository(prisma)
    const strategyRepository: StrategyRepository = new PrismaStrategyRepository(
      prisma,
    )
    const trailingSpotRepository: TrailingRepository =
      new PrismaTrailingSpotRepository(prisma)
    const trailingFuturesRepository: TrailingRepository =
      new PrismaTrailingFuturesRepository(prisma)

    const adxIndicator: AdxIndicator = new AdxIndicator(indicatorsSettings.adx)
    const atrIndicator: AtrIndicator = new AtrIndicator(indicatorsSettings.atr)
    const rsiIndicator: RsiIndicator = new RsiIndicator(indicatorsSettings.rsi)
    const smaIndicator: SmaIndicator = new SmaIndicator(indicatorsSettings.sma)
    const bbIndicator: BbIndicator = new BbIndicator(
      indicatorsSettings.bb.period,
      indicatorsSettings.bb.multiplier,
    )

    this.apiSpotService = new ApiSpotService(apiSettings, binanceApi)
    this.apiFuturesService = new ApiFuturesService(bitmartApi)
    this.apiSpotConcreteService = new ApiSpotService(apiSettings, binanceApi)
    this.apiFuturesConcreteService = new ApiFuturesService(bitmartApi)

    this.equitySpotService = new EquityService(equitySpotRepository)
    this.equityFuturesService = new EquityService(equityFuturesRepository)
    this.equityFullService = new EquityFullService(
      this.equitySpotService,
      this.equityFuturesService,
    )
    this.strategyService = new StrategyService(strategyRepository)
    this.commissionEquitySpotService = new CommissionEquityService(
      commissionEquitySpotRepository,
    )
    this.leverageService = new LeverageService(leverageSettings)
    this.stopsService = new StopsService(stopsSettings)
    this.trailingSpotService = new TrailingService(trailingSpotRepository)
    this.trailingFuturesService = new TrailingService(trailingFuturesRepository)
    this.orderSpotService = new OrderService(orderSpotRepository)
    this.orderFuturesService = new OrderService(orderFuturesRepository)
    this.tradeSpotService = new TradeSpotService(tradeSpotRepository)
    this.tradeFuturesService = new TradeFuturesService(tradeFuturesRepository)
    this.performanceSpotService = new PerformanceService(this.tradeSpotService)
    this.performanceFuturesService = new PerformanceService(
      this.tradeFuturesService,
    )
    this.performanceFullService = new PerformanceFullService(
      this.performanceSpotService,
      this.performanceFuturesService,
    )
    this.investmentSpotService = new InvestmentSpotService(
      tradingSpotSettings,
      this.apiSpotService,
    )
    this.investmentFuturesService = new InvestmentFuturesService(
      tradingFuturesSettings,
      this.apiFuturesService,
      this.leverageService,
    )
    this.positionSpotService = new PositionSpotService(
      this.apiSpotService,
      this.investmentSpotService,
      this.orderSpotService,
      this.tradeSpotService,
      this.trailingSpotService,
    )
    this.positionFuturesService = new PositionFuturesService(
      this.apiFuturesService,
      this.investmentFuturesService,
      this.orderFuturesService,
      this.tradeFuturesService,
      this.trailingFuturesService,
      this.leverageService,
    )
    this.indicatorService = new IndicatorService(
      indicatorRepository,
      smaIndicator,
      rsiIndicator,
      adxIndicator,
      atrIndicator,
      bbIndicator,
    )
    this.predictionService = new PredictionService(
      this.indicatorService,
      this.leverageService,
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
    const accountFuturesManager: ManagerInterface = new AccountManager(
      this.apiFuturesService,
      this.equityFuturesService,
    )
    const marketManager: ManagerInterface = new MarketManager(
      marketSettings.symbols,
      this.apiSpotConcreteService,
      this.predictionService,
      this.strategyService,
    )
    const tradingSpotManager: TradingManager = new TradingManager(
      'spot',
      tradingSpotSettings.symbols,
      this.positionSpotService,
      this.strategyService,
      this.trailingSpotService,
    )
    const tradingFuturesManager: TradingManager = new TradingManager(
      'futures',
      tradingFuturesSettings.symbols,
      this.positionFuturesService,
      this.strategyService,
      this.trailingFuturesService,
    )
    this.launcherMarket = new Launcher(settings.intervalMarketTime, [
      marketManager,
    ])
    this.launcherSpotTrading = new Launcher(settings.intervalTradingTime, [
      tradingSpotManager,
    ])
    this.launcherSpotAccount = new Launcher(settings.intervalAccountTime, [
      accountSpotManager,
      commissionSpotManager,
    ])
    this.launcherFuturesTrading = new Launcher(settings.intervalTradingTime, [
      tradingFuturesManager,
    ])
    this.launcherFuturesAccount = new Launcher(settings.intervalAccountTime, [
      accountFuturesManager,
    ])
  }

  static getLauncherMarket(): Launcher {
    return this.launcherMarket
  }
  static getLauncherSpotTrading(): Launcher {
    return this.launcherSpotTrading
  }
  static getLauncherSpotAccount(): Launcher {
    return this.launcherSpotAccount
  }
  static getLauncherFuturesTrading(): Launcher {
    return this.launcherFuturesTrading
  }
  static getLauncherFuturesAccount(): Launcher {
    return this.launcherFuturesAccount
  }
  static getApiSpotService(): ApiService {
    return this.apiSpotService
  }
  static getApiFuturesService(): ApiService {
    return this.apiFuturesService
  }
  static getApiSpotConcreteService(): ApiSpotService {
    return this.apiSpotConcreteService
  }
  static getApiFuturesConcreteService(): ApiFuturesService {
    return this.apiFuturesConcreteService
  }
  static getEquitySpotService(): EquityService {
    return this.equitySpotService
  }
  static getEquityFuturesService(): EquityService {
    return this.equityFuturesService
  }
  static getEquityFullService(): EquityFullService {
    return this.equityFullService
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
  static getPerformanceSpotService(): PerformanceService {
    return this.performanceSpotService
  }
  static getPerformanceFuturesService(): PerformanceService {
    return this.performanceFuturesService
  }
  static getPerformanceFullService(): PerformanceFullService {
    return this.performanceFullService
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
  static getPredictionService(): PredictionService {
    return this.predictionService
  }
  static getStrategyService(): StrategyService {
    return this.strategyService
  }
  static getTrailingSpotService(): TrailingService {
    return this.trailingSpotService
  }
  static getTrailingFuturesService(): TrailingService {
    return this.trailingFuturesService
  }
}

Container.initialize()
export { Container }
