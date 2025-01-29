import { Kline, KlineInterval } from '../../domain/types/kline'

export interface BinanceApi {
  getPrice(symbol: string): Promise<number>
  getKline(
    symbol: string,
    interval: KlineInterval,
    start: Date,
    end: Date,
  ): Promise<Kline[]>
}
