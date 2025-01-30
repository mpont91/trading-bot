import { Kline, KlineInterval } from '../../domain/types/kline'
import { Balance } from '../../domain/types/balance'

export interface BinanceApi {
  getBalance(): Promise<Balance>
  getPrice(symbol: string): Promise<number>
  getKline(
    symbol: string,
    interval: KlineInterval,
    start: Date,
    end: Date,
  ): Promise<Kline[]>
}
