import {
  Interval,
  RestMarketTypes,
  RestTradeTypes,
  Spot,
} from '@binance/connector-typescript'
import { BinanceApi } from '../../application/api/binance-api'
import { BinanceSettings, settings } from '../../application/settings'
import Bottleneck from 'bottleneck'
import { executeWithRateLimit } from './helpers/execute-with-rate-limit'
import { Kline, KlineInterval } from '../../domain/types/kline'
import {
  mapBinanceToDomainKline,
  mapDomainToBinanceKlineInterval,
} from './mappers/kline-mapper'
import { Balance } from '../../domain/types/balance'

export class BinanceClientApi implements BinanceApi {
  private readonly settings: BinanceSettings = settings.binance
  private readonly client: Spot = new Spot(
    this.settings.binanceApiKey,
    this.settings.binanceApiSecret,
  )
  private readonly limiter: Bottleneck = new Bottleneck({
    maxConcurrent: this.settings.bottleneckMaxConcurrent,
    minTime: this.settings.bottleneckMinTime,
  })

  async getBalance(): Promise<Balance> {
    const params: RestTradeTypes.accountInformationOptions = {
      omitZeroBalances: true,
    }
    const response: RestTradeTypes.accountInformationResponse =
      await this.client.accountInformation(params)

    let equity: number = 0
    let available: number = 0

    for (const balance of response.balances) {
      if (balance.asset === this.settings.feeCurrency) {
        continue
      }

      const quantity: number = parseFloat(balance.free)

      if (balance.asset === this.settings.baseCurrency) {
        equity += quantity
        available += quantity
        continue
      }

      const price: number = await this.getPrice(
        balance.asset + this.settings.baseCurrency,
      )
      equity += parseFloat(balance.free) * price
    }

    return {
      equity: equity,
      available: available,
    }
  }

  async getPrice(symbol: string): Promise<number> {
    const task = async (): Promise<number> => {
      const params: RestMarketTypes.symbolPriceTickerOptions = {
        symbol: symbol,
      }
      const response: RestMarketTypes.symbolPriceTickerResponse =
        (await this.client.symbolPriceTicker(
          params,
        )) as RestMarketTypes.symbolPriceTickerResponse

      return parseFloat(response.price)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async getKline(
    symbol: string,
    interval: KlineInterval,
    start: Date,
    end: Date,
  ): Promise<Kline[]> {
    const task = async (): Promise<Kline[]> => {
      const options: RestMarketTypes.klineCandlestickDataOptions = {
        startTime: start.getTime(),
        endTime: end.getTime(),
      }
      const binanceKlineInterval: Interval =
        mapDomainToBinanceKlineInterval(interval)
      const response: RestMarketTypes.klineCandlestickDataResponse[] =
        await this.client.klineCandlestickData(
          symbol,
          binanceKlineInterval,
          options,
        )

      return response.map(mapBinanceToDomainKline)
    }
    return executeWithRateLimit(this.limiter, task)
  }
}
