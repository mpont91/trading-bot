import { BitmartApi } from '../../application/api/bitmart-api'
import {
  APIResponse,
  FuturesAccountAsset,
  FuturesClientV2,
  FuturesContractDetails,
} from 'bitmart-api'
import { BitmartSettings } from '../../application/settings'
import { settings } from '../../application/settings'
import Bottleneck from 'bottleneck'
import { Balance } from '../../domain/types/balance'
import { executeWithRateLimit } from './helpers/execute-with-rate-limit'
import { mapBitmartToDomainBalance } from './mappers/balance-mapper'
import { Symbol } from '../../domain/types/symbol'
import { mapBitmartToDomainSymbol } from './mappers/symbol-mapper'

export class BitmartClientApi implements BitmartApi {
  private readonly settings: BitmartSettings = settings.bitmart
  private readonly client: FuturesClientV2 = new FuturesClientV2({
    apiKey: this.settings.bitmartApiKey,
    apiSecret: this.settings.bitmartApiSecret,
    apiMemo: this.settings.bitmartApiMemo,
  })
  private readonly limiter: Bottleneck = new Bottleneck({
    maxConcurrent: this.settings.bottleneckMaxConcurrent,
    minTime: this.settings.bottleneckMinTime,
  })

  async getBalance(): Promise<Balance> {
    const task = async (): Promise<Balance> => {
      const response: APIResponse<FuturesAccountAsset[]> =
        await this.client.getFuturesAccountAssets()

      this.validateResponse(response)
      return mapBitmartToDomainBalance(response.data[0])
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async getSymbol(symbol: string): Promise<Symbol> {
    const task = async (): Promise<Symbol> => {
      const response: APIResponse<{
        symbols: FuturesContractDetails[]
      }> = await this.client.getFuturesContractDetails({ symbol: symbol })

      this.validateResponse(response)

      return mapBitmartToDomainSymbol(response.data.symbols[0])
    }

    return executeWithRateLimit(this.limiter, task)
  }

  private validateResponse<T>(response: APIResponse<T>): void {
    if (response.code !== 1000) {
      throw new Error(
        `Bitmart API error: ${response.message} (retCode: ${response.code})`,
      )
    }
  }
}
