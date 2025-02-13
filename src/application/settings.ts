import { config } from 'dotenv-safe'
import { KlineInterval } from '../domain/types/kline'
import { Side } from '../domain/types/side'

config()

export interface Settings {
  intervalExecutionTime: number
  intervalReportTime: number
  bitmart: BitmartSettings
  binance: BinanceSettings
  api: ApiSettings
  spotTrading: TradingSettings
  futuresTrading: TradingSettings
  indicators: IndicatorsSettings
  market: MarketSettings
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

export interface IndicatorsSettings {
  periods: {
    adx: number[]
    atr: number[]
    rsi: number[]
    sma: number[]
  }
  rules: IndicatorsRulesSettings
}

export interface IndicatorsRulesSettings {
  side: IndicatorSideRuleSettings[]
  leverage: IndicatorLeverageRuleSettings[]
  tp: IndicatorAtrMultiplier[]
  sl: IndicatorAtrMultiplier[]
}

export interface IndicatorAtrMultiplier {
  period: number
  multiplier: number
}

export interface IndicatorSideRuleSettings {
  value: Side
  conditions: IndicatorConditionRuleSettings[]
}
export interface IndicatorLeverageRuleSettings {
  value: number
  conditions: IndicatorConditionRuleSettings[]
}

export interface IndicatorConditionRuleSettings {
  indicator: Indicator
  period: number
  threshold: number
  condition: ConditionOperator
}

export type Indicator = 'adx' | 'atr' | 'rsi' | 'sma'
export type ConditionOperator = '>' | '<'

export interface MarketSettings {
  symbols: string[]
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
    klineHistoryInterval: 5, // 5 minutes
    klineHistoryLimit: 240, // 5 minutes * 240 candles = 20 hours price history
  },
  spotTrading: {
    symbols: ['ETHUSDC'],
    safetyCapitalMargin: 0.3,
  },
  futuresTrading: {
    symbols: ['ETHUSDT'],
    safetyCapitalMargin: 0.3,
  },
  indicators: {
    periods: {
      adx: [10, 14],
      atr: [10, 14],
      rsi: [7, 14],
      sma: [20, 50],
    },
    rules: {
      side: [
        {
          value: 'long',
          conditions: [
            { indicator: 'rsi', period: 7, threshold: 40, condition: '<' },
            { indicator: 'adx', period: 10, threshold: 20, condition: '>' },
            { indicator: 'sma', period: 20, threshold: 50, condition: '>' },
          ],
        },
        {
          value: 'short',
          conditions: [
            { indicator: 'rsi', period: 7, threshold: 60, condition: '>' },
            { indicator: 'adx', period: 10, threshold: 20, condition: '>' },
            { indicator: 'sma', period: 20, threshold: 50, condition: '<' },
          ],
        },
        {
          value: 'hold',
          conditions: [],
        },
      ],
      leverage: [
        {
          value: 10,
          conditions: [
            { indicator: 'adx', period: 10, threshold: 30, condition: '>' },
          ],
        },
        {
          value: 5,
          conditions: [
            { indicator: 'adx', period: 10, threshold: 20, condition: '>' },
          ],
        },
        {
          value: 1,
          conditions: [],
        },
      ],
      tp: [
        {
          period: 14,
          multiplier: 2.5,
        },
        {
          period: 10,
          multiplier: 3,
        },
      ],
      sl: [
        {
          period: 14,
          multiplier: 1.25,
        },
        {
          period: 10,
          multiplier: 1.5,
        },
      ],
    },
  },
  market: {
    symbols: ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'SOLUSDT'],
  },
}
