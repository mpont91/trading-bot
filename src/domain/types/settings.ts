import { KlineInterval } from './kline'

export interface Settings {
  intervalTradingTime: number
  intervalMarketTime: number
  intervalAccountTime: number
  binance: BinanceSettings
  maxPositionsOpened: number
  symbols: string[]
  safetyCapitalMargin: number
  history: HistorySettings
  indicators: IndicatorsSettings
  risk: RiskSettings
}

export interface BinanceSettings {
  binanceApiKey: string
  binanceApiSecret: string
  bottleneckMaxConcurrent: number
  bottleneckMinTime: number
  baseCurrency: string
  feeCurrency: string
}

export interface HistorySettings {
  klineHistoryInterval: KlineInterval
  klineHistoryLimit: number
}

export interface IndicatorsSettings {
  adx: number
  atr: number
  rsi: number
  sma: number
  bb: {
    period: number
    multiplier: number
  }
  smaCross: {
    periodLong: number
    periodShort: number
  }
}

export interface RiskSettings {
  favorableEntryPriceMaxBB: number
  strongTrendMinADX: number
  bullishMomentumMinRSI: number
  bullishMomentumMaxRSI: number
  bearishMomentumMaxRSI: number
  bearishConvictionMinADX: number
  trailingStopMultiplier: number
}
