import { config } from 'dotenv-safe'
import { Settings } from '../domain/types/settings'

config()

export const settings: Settings = {
  intervalTradingTime: parseInt(process.env.INTERVAL_TRADING_TIME!),
  intervalMarketTime: parseInt(process.env.INTERVAL_MARKET_TIME!),
  intervalAccountTime: parseInt(process.env.INTERVAL_ACCOUNT_TIME!),
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
  trading: {
    maxPositionsOpened: 5,
    symbols: ['BTCUSDC', 'ETHUSDC', 'XRPUSDC', 'SOLUSDC', 'ADAUSDC'],
    safetyCapitalMargin: 0.3,
  },
  indicators: {
    sma: 20,
    rsi: 14,
    adx: 14,
    atr: 14,
    bb: {
      period: 20,
      multiplier: 2.5,
    },
    smaCross: {
      periodLong: 50,
      periodShort: 20,
    },
  },
  stops: {
    tp: 0.05,
    sl: 0.03,
  },
}
