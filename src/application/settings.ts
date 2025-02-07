import { config } from 'dotenv-safe'
import { KlineInterval } from '../domain/types/kline'

config()

export interface Settings {
  intervalExecutionTime: number
  intervalReportTime: number
  bitmart: BitmartSettings
  binance: BinanceSettings
  api: ApiSettings
  spotTrading: TradingSettings
  futuresTrading: TradingSettings
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
  priceHistoryKlineInterval: KlineInterval
  priceHistoryKlineLimit: number
}

export interface TradingSettings {
  symbols: string[]
  safetyCapitalMargin: number
}

export const settings: Settings = {
  intervalExecutionTime: parseInt(process.env.INTERVAL_EXECUTION_TIME!),
  intervalReportTime: parseInt(process.env.INTERVAL_REPORT_TIME!),
  bitmart: {
    bitmartApiKey: process.env.BITMART_API_KEY!,
    bitmartApiSecret: process.env.BITMART_SECRET_KEY!,
    bitmartApiMemo: process.env.BITMART_MEMO!,
    bottleneckMaxConcurrent: 1,
    bottleneckMinTime: 1000,
    baseCurrency: 'USDT',
  },
  binance: {
    binanceApiKey: process.env.BINANCE_API_KEY!,
    binanceApiSecret: process.env.BINANCE_SECRET_KEY!,
    bottleneckMaxConcurrent: 1,
    bottleneckMinTime: 500,
    baseCurrency: 'USDC',
    feeCurrency: 'BNB',
  },
  api: {
    priceHistoryKlineInterval: 5, // 5 minutes
    priceHistoryKlineLimit: 240, // 5 minutes * 120 candles = 10 hours price history
  },
  spotTrading: {
    symbols: ['ETHUSDT'],
    safetyCapitalMargin: 0.3,
  },
  futuresTrading: {
    symbols: ['ETHUSDT'],
    safetyCapitalMargin: 0.3,
  },
}
