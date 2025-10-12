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
}
