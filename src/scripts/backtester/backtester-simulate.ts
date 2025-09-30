import fs from 'fs'
import { Kline } from '../../domain/types/kline'

export default async function (args: string[]): Promise<void> {
  const [symbol] = args

  if (!symbol) {
    throw new Error('Missing required argument: symbol')
  }

  const file: string = `./data/${symbol.toLowerCase()}.json`

  if (!fs.existsSync(file)) {
    throw new Error(
      `Data file not found. Please run backtester-fetch first. File: ${file}`,
    )
  }

  const klines: Kline[] = JSON.parse(
    fs.readFileSync(`./data/${symbol.toLowerCase()}.json`, 'utf-8'),
  )

  console.log('Backtest finished!')
}
