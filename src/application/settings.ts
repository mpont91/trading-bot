import { config } from 'dotenv-safe'
import { Settings } from '../domain/types/settings'

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
  history: {
    klineHistoryInterval: 5,
    klineHistoryLimit: parseNumber(process.env.HISTORY_CANDLES, 240), // 5 minutes * 240 candles = 20 hours price history
  },
  indicators: {
    sma: parseNumber(process.env.INDICATOR_SMA_PERIOD, 20),
    rsi: parseNumber(process.env.INDICATOR_RSI_PERIOD, 14),
    adx: parseNumber(process.env.INDICATOR_ADX_PERIOD, 14),
    atr: parseNumber(process.env.INDICATOR_ATR_PERIOD, 14),
    bb: {
      period: parseNumber(process.env.INDICATOR_BB_PERIOD, 20),
      multiplier: parseNumber(process.env.INDICATOR_BB_MULTIPLIER, 2.5),
    },
    smaCross: {
      periodLong: parseNumber(process.env.INDICATOR_SMA_CROSS_PERIOD_LONG, 50),
      periodShort: parseNumber(
        process.env.INDICATOR_SMA_CROSS_PERIOD_SHORT,
        20,
      ),
    },
  },
  risk: {
    favorableEntryPriceMaxBB: parseNumber(
      process.env.RISK_FAVORABLE_ENTRY_PRICE_MAX_BB,
      0.5,
    ),
    strongTrendMinADX: parseNumber(process.env.RISK_STRONG_TREND_MIN_ADX, 25),
    bullishMomentumMinRSI: parseNumber(
      process.env.RISK_BULLISH_MOMENTUM_MIN_RSI,
      50,
    ),
    bullishMomentumMaxRSI: parseNumber(
      process.env.RISK_BULLISH_MOMENTUM_MAX_RSI,
      70,
    ),
    bearishMomentumMaxRSI: parseNumber(
      process.env.RISK_BEARISH_MOMENTUM_MAX_RSI,
      45,
    ),
    bearishConvictionMinADX: parseNumber(
      process.env.RISK_BEARISH_CONVICTION_MIN_ADX,
      22,
    ),
    trailingStopMultiplier: parseNumber(
      process.env.RISK_TRAILING_STOP_MULTIPLIER,
      1.5,
    ),
  },
}
