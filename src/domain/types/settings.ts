import { KlineInterval } from './kline'
import { Side } from './side'

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
  tp: IndicatorTPSLRuleSettings
  sl: IndicatorTPSLRuleSettings
}

export interface IndicatorTPSLRuleSettings {
  atr: IndicatorAtrMultiplier[]
  min: number
  max: number
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
  threshold?: number
  compareWith?: ConditionCompareWith
  condition: ConditionOperator
}

export interface ConditionCompareWith {
  indicator: Indicator
  period: number
}

export type Indicator = 'adx' | 'atr' | 'rsi' | 'sma'
export type ConditionOperator = '>' | '<'

export interface MarketSettings {
  symbols: string[]
}
