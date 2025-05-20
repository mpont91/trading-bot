import { config } from 'dotenv-safe'
import { Settings } from '../domain/types/settings'

config()

export const settings: Settings = {
  intervalTradingTime: parseInt(process.env.INTERVAL_TRADING_TIME!),
  intervalMarketTime: parseInt(process.env.INTERVAL_MARKET_TIME!),
  intervalAccountTime: parseInt(process.env.INTERVAL_ACCOUNT_TIME!),
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
    symbols: [
      'BTCUSDC',
      'ETHUSDC',
      'XRPUSDC',
      'SOLUSDC',
      'ADAUSDC',
      'HBARUSDC',
    ],
    safetyCapitalMargin: 0.3,
  },
  futuresTrading: {
    symbols: [
      'DOGEUSDT',
      'ADAUSDT',
      'TRXUSDT',
      'LINKUSDT',
      'XLMUSDT',
      'HBARUSDT',
    ],
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
  leverage: 1,
}
