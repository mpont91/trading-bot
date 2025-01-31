import { Kline, KlineInterval } from '../../domain/types/kline'
import { Api } from './api'

export interface BinanceApi extends Api {
  getPrice(symbol: string): Promise<number>
  getKline(
    symbol: string,
    interval: KlineInterval,
    start: Date,
    end: Date,
  ): Promise<Kline[]>
}
