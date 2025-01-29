import { Interval, RestMarketTypes, Spot } from '@binance/connector-typescript'
import { BinanceApi } from '../../application/api/binance-api'
import { BinanceSettings, settings } from '../../application/settings'
import Bottleneck from 'bottleneck'
import { executeWithRateLimit } from './helpers/execute-with-rate-limit'
import { Kline, KlineInterval } from '../../domain/types/kline'
import {
  domainMapBinanceKlineInterval,
  mapBinanceKline,
} from './mappers/kline-mapper'

export class BinanceClientApi implements BinanceApi {
  private readonly client: Spot
  private readonly settings: BinanceSettings = settings.binance
  private readonly limiter: Bottleneck

  constructor() {
    this.client = new Spot(
      this.settings.binanceApiKey,
      this.settings.binanceApiSecret,
    )
    this.limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 500,
    })
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
        domainMapBinanceKlineInterval(interval)
      const response: RestMarketTypes.klineCandlestickDataResponse[] =
        await this.client.klineCandlestickData(
          symbol,
          binanceKlineInterval,
          options,
        )

      return response.map(mapBinanceKline)
    }
    return executeWithRateLimit(this.limiter, task)
  }
}
