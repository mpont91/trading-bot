import { Spot } from '@binance/connector-typescript'
import { BinanceApi } from '../../application/api/binance-api'
import { BinanceSettings, settings } from '../../application/settings'
import Bottleneck from 'bottleneck'

export class BinanceClientApi implements BinanceApi {
  private readonly client: Spot
  private readonly settings: BinanceSettings = settings.binance
  private readonly limiter: Bottleneck = new Bottleneck({
    maxConcurrent: 1,
    minTime: 500,
  })

  constructor() {
    this.client = new Spot(
      this.settings.binanceApiKey,
      this.settings.binanceApiSecret,
    )
  }
}
