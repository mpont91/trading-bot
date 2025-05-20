import { KlineInterval } from './kline'

export interface Settings {
  intervalTradingTime: number
  intervalMarketTime: number
  intervalAccountTime: number
  bitmart: BitmartSettings
  binance: BinanceSettings
  api: ApiSettings
  spotTrading: TradingSettings
  futuresTrading: TradingSettings
  indicators: IndicatorsSettings
  stops: StopsSettings
  leverage: number
}

export interface BitmartSettings {
  bitmartApiKey: string
  bitmartApiSecret: string
  bitmartApiMemo: string
  bottleneckMaxConcurrent: number
  bottleneckMinTime: number
  baseCurrency: string
}

export interface BinanceSettings {
  binanceApiKey: string
  binanceApiSecret: string
  bottleneckMaxConcurrent: number
  bottleneckMinTime: number
  baseCurrency: string
  feeCurrency: string
}

export interface ApiSettings {
  klineHistoryInterval: KlineInterval
  klineHistoryLimit: number
}

export interface TradingSettings {
  symbols: string[]
  safetyCapitalMargin: number
}

export interface MarketSettings {
  symbols: string[]
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

export interface StopsSettings {
  tp: number | null
  sl: number | null
}
