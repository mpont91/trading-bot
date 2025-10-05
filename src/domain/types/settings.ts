import { TimeFrame } from './candle'

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
  timeFrame: TimeFrame
  candles: number
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
  buyScoreMin: number
  favorableEntryPriceMaxBB: number
  strongTrendMinADX: number
  bullishMomentumMinRSI: number
  bullishMomentumMaxRSI: number
  bearishMomentumMaxRSI: number
  bearishConvictionMinADX: number
  trailingStopMultiplier: number
}
