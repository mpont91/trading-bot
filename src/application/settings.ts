import { config } from 'dotenv-safe'

config()

export interface Settings {
  intervalExecutionTime: number
  intervalReportingTime: number
  bitmart: BitmartSettings
  binance: BinanceSettings
}

export interface BitmartSettings {
  bitmartApiKey: string
  bitmartApiSecret: string
  bitmartApiMemo: string
}

export interface BinanceSettings {
  binanceApiKey: string
  binanceApiSecret: string
}

export const settings: Settings = {
  intervalExecutionTime: parseInt(process.env.INTERVAL_EXECUTION_TIME!),
  intervalReportingTime: parseInt(process.env.INTERVAL_REPORTING_TIME!),
  bitmart: {
    bitmartApiKey: process.env.BITMART_API_KEY!,
    bitmartApiSecret: process.env.BITMART_SECRET_KEY!,
    bitmartApiMemo: process.env.BITMART_MEMO!,
  },
  binance: {
    binanceApiKey: process.env.BINANCE_API_KEY!,
    binanceApiSecret: process.env.BINANCE_SECRET_KEY!,
  },
}
