import { KlineInterval } from './kline'

export interface Settings {
  intervalTradingTime: number
  intervalMarketTime: number
  intervalAccountTime: number
  binance: BinanceSettings
  api: ApiSettings
  maxPositionsOpened: number
  symbols: string[]
  safetyCapitalMargin: number
  indicators: IndicatorsSettings
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
