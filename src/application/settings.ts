import { config } from 'dotenv-safe'
import {
  Settings,
  StrategySMACrossSimpleSettings,
} from '../domain/types/settings'
import { TimeFrame } from '../domain/types/candle'

config()

function parseNumber(
  value: string | null | undefined,
  defaultValue: number,
): number {
  if (value === undefined || value === null || value === '') {
    return defaultValue
  }

  const parsedValue: number = Number(value)
  return isNaN(parsedValue) ? defaultValue : parsedValue
}

const smaCrossSimpleStrategySettings: StrategySMACrossSimpleSettings = {
  timeFrame: TimeFrame['1h'],
  candles: parseNumber(process.env.STRATEGY_SMA_CROSS_SIMPLE_CANDLES, 240),
  indicators: {
    sma: parseNumber(
      process.env.STRATEGY_SMA_CROSS_SIMPLE_INDICATOR_SMA_PERIOD,
      20,
    ),
    rsi: parseNumber(
      process.env.STRATEGY_SMA_CROSS_SIMPLE_INDICATOR_RSI_PERIOD,
      14,
    ),
    adx: parseNumber(
      process.env.STRATEGY_SMA_CROSS_SIMPLE_INDICATOR_ADX_PERIOD,
      14,
    ),
    atr: parseNumber(
      process.env.STRATEGY_SMA_CROSS_SIMPLE_INDICATOR_ATR_PERIOD,
      14,
    ),
    bb: {
      period: parseNumber(
        process.env.STRATEGY_SMA_CROSS_SIMPLE_INDICATOR_BB_PERIOD,
        20,
      ),
      stdDev: parseNumber(
        process.env.STRATEGY_SMA_CROSS_SIMPLE_INDICATOR_BB_STD_DEV,
        2.5,
      ),
    },
    smaCross: {
      periodLong: parseNumber(
        process.env.STRATEGY_SMA_CROSS_SIMPLE_INDICATOR_SMA_CROSS_PERIOD_LONG,
        50,
      ),
      periodShort: parseNumber(
        process.env.STRATEGY_SMA_CROSS_SIMPLE_INDICATOR_SMA_CROSS_PERIOD_SHORT,
        20,
      ),
    },
  },
  tp: parseNumber(process.env.STRATEGY_SMA_CROSS_SIMPLE_TP, 0.05),
  sl: parseNumber(process.env.STRATEGY_SMA_CROSS_SIMPLE_SL, 0.02),
  ts: parseNumber(process.env.STRATEGY_SMA_CROSS_SIMPLE_TS, 0.01),
}

export const settings: Settings = {
  intervalTradingTime: parseNumber(process.env.INTERVAL_TRADING_TIME, 90000),
  intervalMarketTime: parseNumber(process.env.INTERVAL_MARKET_TIME, 90000),
  intervalAccountTime: parseNumber(process.env.INTERVAL_ACCOUNT_TIME, 900000),
  binance: {
    binanceApiKey: process.env.BINANCE_API_KEY!,
    binanceApiSecret: process.env.BINANCE_SECRET_KEY!,
    bottleneckMaxConcurrent: 1,
    bottleneckMinTime: 500,
    baseCurrency: 'USDC',
    feeCurrency: 'BNB',
  },
  symbols: ['BTCUSDC', 'ETHUSDC', 'XRPUSDC', 'SOLUSDC', 'ADAUSDC'],
  maxPositionsOpened: parseNumber(process.env.MAX_POSITIONS_OPENED, 5),
  safetyCapitalMargin: parseNumber(process.env.SAFETY_CAPITAL_MARGIN, 0.3),
  strategy: process.env.STRATEGY || 'sma-cross-simple',
  strategies: {
    smaCrossSimple: smaCrossSimpleStrategySettings,
  },
}
