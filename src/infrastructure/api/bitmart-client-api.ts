import { BitmartApi } from '../../application/api/bitmart-api'
import { FuturesClientV2 } from 'bitmart-api'
import { BitmartSettings } from '../../application/settings'
import { settings } from '../../application/settings'
import Bottleneck from 'bottleneck'

export class BitmartClientApi implements BitmartApi {
  private readonly client: FuturesClientV2
  private readonly settings: BitmartSettings = settings.bitmart
  private readonly limiter: Bottleneck

  constructor() {
    this.limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 1000,
    })
    this.client = new FuturesClientV2({
      apiKey: this.settings.bitmartApiKey,
      apiSecret: this.settings.bitmartApiSecret,
      apiMemo: this.settings.bitmartApiMemo,
    })
  }
}
